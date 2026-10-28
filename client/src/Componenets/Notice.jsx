import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios.js";

const Notice = () => {
  const { groupId } = useParams();
  const [items, setItems] = useState([]);
  const [addItems, setAddItems] = useState([]);
  const [draft, setDraft] = useState(items);
  const [isEditing, setIsEditing] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  //getting the notices
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.get(`/notice/${groupId}`);

        console.log(response);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    };

    fetchNotices();
  });

  const handleEdit = () => {
    setDraft(items.map((item) => ({ ...item })));
    setIsEditing(true);
  };

  const handleChange = (id, field, value) => {
    setDraft(
      items.map((item) =>
        item.id === id ? { ...items, [field]: value } : items,
      ),
    );
    setIsEditing(true);
  };

  const handleSaveEdit = () => {};

  const handleSave = async () => {
    try {
     const savedItems = draft.map(
      ({ isNew, ...item }) => item
    );
      if (newNotices.length > 0) {
        await api.post(`/notice/${groupId}/create`, newNotices);
      }

      console.log("notices saved successfully!!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setDraft(items.map((item) => ({ ...item })));
    setIsEditing(false);
  };

  const handleDelete = () => {};

  const handleAddMore = () => {
    const newItem = {
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
     const savedItems = draft
     .filter((item) => item.isNew)
     .map(
      ({ isNew, ...item }) => item
    );
      if (newNotices.length > 0) {
        await api.post(`/notice/${groupId}/create`, newNotices);
      }

      console.log("notices saved successfully!!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button>Edit or update</button>

      <button>Cancel</button>

      <button>Add More +</button>

      <button>Save</button>
    </div>
  );
};

export default Notice;
