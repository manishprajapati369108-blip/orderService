import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios.js";

const Notice = () => {
  const { groupId } = useParams();
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState(items);
  const [isEditing, setIsEditing] = useState(false);

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

      const applyUpdates = (list) => {
       return list.map((item) => {
          const updated = updatedNotices.find(
            (notice) => notice._id === item._id,
          );

          return updated ? { ...item, ...updated } : item;
        });
      };

      setItems((prev) => applyUpdates(prev));

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
    3;
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
      console.log(error);
    }
  };

  const handlePin = async(itemId, currentStatus) => {
    try {

      const pinTrigger = !currentStatus;
      const response = await api.patch(`/notice/${groupId}/${itemId}/${pinTrigger}`);

      setItems((prev) => prev.map((item) => item._id === itemId ? ({...item, isPinned: pinTrigger}) : item ).sort((a,b) => {
      if( a.isPinned !== b.isPinned)  {
        return Number(b.isPinned) - Number(a.isPinned)
      }

      return new Date(b.createdAt) - new Date(a.createdAt)
     } ))
      console.log(response?.data?.message)
      console.log(response?.data?.result)
    } catch (error) {
      console.log(error?.response);
    }
  };

  const displayItems =
    isEditing || draft.some((item) => item.isNew) ? draft : items;

  return (
    <div>
      <button
        onClick={!isEditing ? handleEdit : handleSaveEdit}
        disabled={draft.some((item) => item.isNew)}
      >
        {!isEditing ? "Edit" : "Save Update"}
      </button>

      <button
        disabled={!isEditing && !draft.some((item) => item.isNew)}
        onClick={handleCancel}
      >
        Cancel
      </button>

      <button onClick={handleAddMore}>Add More +</button>

      <button onClick={handleSave}>Save New</button>

      {displayItems.map((item) => {
        const editable = isEditing || item.isNew;
        const key = item._id || item.id;

        return (
          <div key={key}>
            <div>
              {editable ? (
                <div>
                  <input
                    className="border"
                    value={item.title}
                    onChange={(e) => handleChange(key, "title", e.target.value)}
                  />

                  <textarea
                    value={item.content}
                    onChange={(e) =>
                      handleChange(key, "content", e.target.value)
                    }
                  />
                </div>
              ) : (
                <div>
                  {item.isPinned && <div>📌</div>}
                  <h1>{item.title || "Untitled"}</h1>
                  <p>{item.content || "No content"}</p>
                  <button onClick={() => handlePin(item._id, item.isPinned )} className="cursor-pointer">
                    {item.isPinned ? "Unpin" : "Pin" }
                  </button>
                  <div onClick={() => handleDelete(item._id)}>Delete</div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Notice;
