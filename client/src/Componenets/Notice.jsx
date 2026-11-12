import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios.js";

const Notice = () => {
  const { groupId } = useParams();
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState(items);
  const [isEditing, setIsEditing] = useState(false);

  //getting the notices
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
    setDraft(items.map((item) => ({ ...item }))); //here items becomes prev so we dont need  to use items.map in handle change.
    setIsEditing(true);
  };

  const handleChange = (id, field, value) => {
    setDraft((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, [field]: value } : item,
      ),
    );
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedNotices = draft.filter((item) => {
        //filter is just condtion  not a function so dont expect any value  it true that item stays if false item get excluded  here return is just for performing the true and false
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

          return updated ? {...item, ...updated} : item;
        }),
      );

      
      console.log("Changed notices updated successFully");
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
          : items.map((item) => ({ ...item })); // i can use items here also because

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

      await api.post(`/notice/${groupId}/create`, newNotices);

      console.log("notices saved successfully!!");

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const displayItems =
    isEditing || draft.some((item) => item.isNew) ? draft : items;

  console.log(
    displayItems.map((item) => ({
      id: item._id || item.id,
      title: item.title,
    })),
  );

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

        return (
          <div key={item._id || item.id}>
            <div>
              {editable ? (
                <div>
                  <input
                    className="border"
                    value={item.title}
                    onChange={(e) =>
                      handleChange(item._id, "title", e.target.value)
                    }
                  />

                  <textarea
                    value={item.content}
                    onChange={(e) =>
                      handleChange(item._id, "content", e.target.value)
                    }
                  />
                </div>
              ) : (
                <div>
                  <h1>{item.title || "Untitled"}</h1>
                  <p>{item.content || "No content"}</p>
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
