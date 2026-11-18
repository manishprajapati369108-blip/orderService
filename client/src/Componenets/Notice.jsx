import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios.js";

const Notice = () => {
  const { groupId } = useParams();
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState(items);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedNotices, setExpandedNotices] = useState({});

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.get(`/notice/${groupId}`);
        setItems(response?.data?.result || []);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    };

    fetchNotices();
  }, [groupId]);

  const handleEdit = () => {
    setDraft(items.map((item) => ({ ...item })));
    setIsEditing(true);
  };

  const handleChange = (id, field, value) => {
    setDraft((prev) =>
      prev.map((item) =>
        (item._id || item.id) === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSaveEdit = async () => {
    try {
      const updatedNotices = draft.filter((item) => {
        if (item.isNew) return false;

        const original = items.find((notice) => notice._id === item._id);

        return (
          original &&
          (original.title !== item.title || original.content !== item.content)
        );
      });

      if (updatedNotices.length === 0) {
        console.log("No changes found");
        return;
      }

      await api.patch(
        `/notice/${groupId}/update`,
        updatedNotices.map(({ isNew, ...item }) => item),
      );

      setItems((prev) =>
        prev.map((item) => {
          const updated = updatedNotices.find(
            (notice) => notice._id === item._id,
          );
          return updated ? { ...item, ...updated } : item;
        }),
      );

      setDraft([]);
      setIsEditing(false);
      console.log("Changed notices updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setDraft(items.map((item) => ({ ...item })));
    setIsEditing(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/notice/${groupId}/delete/${id}`);

      console.log(response?.data?.message);
      setItems((prev) => prev.filter((item) => item._id !== id));
      setDraft((prev) => prev.filter((item) => (item._id || item.id) !== id));
    } catch (error) {
      console.log(error);
    }
    setIsEditing(false);
  };

  const handleAddMore = () => {
    const newItem = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      isNew: true,
    };

    setDraft((prev) => {
      const currentItems =
        isEditing || prev.some((item) => item.isNew)
          ? prev
          : items.map((item) => ({ ...item }));

      return [...currentItems, newItem];
    });
  };

  const handleSave = async () => {
    try {
      const newNotices = draft
        .filter((item) => item.isNew)
        .map(({ isNew, ...item }) => item);

      if (newNotices.length === 0) {
        console.log("No new notices to save.");
        return;
      }

      const response = await api.post(`/notice/${groupId}/create`, newNotices);

      const created = response?.data?.result || [];

      setItems((prev) => [...prev, ...created]);
      setDraft([]);
      console.log("Notices saved successfully!!");
      setIsEditing(false);
    } catch (error) {
      console.log("Axios Error:", error);
    }
  };

  const handlePin = async (itemId, currentStatus) => {
    try {
      const pinTrigger = !currentStatus;

      const response = await api.patch(
        `/notice/${groupId}/${itemId}/${pinTrigger}`,
      );

      setItems((prev) =>
        prev
          .map((item) =>
            item._id === itemId ? { ...item, isPinned: pinTrigger } : item,
          )
          .sort((a, b) => {
            if (a.isPinned !== b.isPinned) {
              return Number(b.isPinned) - Number(a.isPinned);
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
          }),
      );

      console.log(response?.data?.message);
    } catch (error) {
      console.log(error?.response);
    }
  };

  const displayItems =
    isEditing || draft.some((item) => item.isNew) ? draft : items;

  const hasNewItems = draft.some((item) => item.isNew);

  const toggleReadMore = (id) => {
    setExpandedNotices((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Notices
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Stay updated with the latest announcements.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={!isEditing ? handleEdit : handleSaveEdit}
              disabled={hasNewItems}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEditing ? "Save Update" : "Edit"}
            </button>

            <button
              onClick={handleCancel}
              disabled={!isEditing && !hasNewItems}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleAddMore}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              + Add More
            </button>

            <button
              onClick={handleSave}
              disabled={!hasNewItems}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save New
            </button>
          </div>
        </div>

        {/* Notice Count */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-700">
            All Announcements
          </h2>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {displayItems.length} Notices
          </span>
        </div>

        {/* Notice Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {displayItems.map((item) => {
            const editable = isEditing || item.isNew;
            const key = item._id || item.id;

            return (
              <div
                key={key}
                className={`group relative rounded-xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                  item.isPinned
                    ? "border-blue-300 ring-1 ring-blue-100"
                    : "border-slate-200"
                }`}
              >
                {editable ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-600">
                        {item.isNew ? "New Notice" : "Edit Notice"}
                      </span>
                    </div>

                    <input
                      type="text"
                      placeholder="Enter notice title..."
                      value={item.title}
                      onChange={(e) =>
                        handleChange(key, "title", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                    <textarea
                      rows={5}
                      placeholder="Write your notice here..."
                      value={item.content}
                      onChange={(e) =>
                        handleChange(key, "content", e.target.value)
                      }
                      className="w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                ) : (
                  /* View Mode */
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.isPinned && (
                          <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            📌 Pinned
                          </span>
                        )}

                        {!item.isPinned && (
                          <span className="text-xs font-medium text-slate-400">
                            Announcement
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handlePin(item._id, item.isPinned)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          item.isPinned
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {item.isPinned ? "Unpin" : "📌 Pin"}
                      </button>
                    </div>

                    <h3 className="mb-3 wrap-break-word text-xl font-bold text-slate-800">
                      {item.title || "Untitled"}
                    </h3>

                    <p
                      className={
                        !expandedNotices[key]
                          ? "min-h-16 whitespace-pre-wrap wrap-break-word text-sm leading-7 text-slate-600 line-clamp-3"
                          : "min-h-16 whitespace-pre-wrap wrap-break-word text-sm leading-7 text-slate-600"
                      }
                    >
                      {item.content || "No content"}
                    </p>

                    {item.content?.length > 150 && (
                      <button onClick={() => toggleReadMore(key)}>
                        {expandedNotices[key] ? "Read Less" : "Read More"}
                      </button>
                    )}

                    <div className="mt-5 flex items-center justify-end border-t border-slate-100 pt-4">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-700"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {displayItems.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mb-3 text-5xl">📢</div>

            <h3 className="text-lg font-semibold text-slate-700">
              No notices available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Click Add More to create your first announcement.
            </p>

            <button
              onClick={handleAddMore}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Create Notice
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notice;
