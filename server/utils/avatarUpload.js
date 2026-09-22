import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

const avatarUpload = async (req, res) => {
  try {
    const { data, error } = await supabase.storage
      .from("order-service-1")
      .upload(`avatar/${Date.now()}`, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      return res.status(500).json({
        success: false,
        error: "setting avatar failed",
      });
    }

    const { data: getUrlImage } = supabase.storage
      .from("chat-app-1")
      .getPublicUrl(data.path);

    const imageUrl = getUrlImage.publicUrl;

    res.status(201).json({
      success: true,
      file: data.path,
      url: imageUrl,
      message: "Avatar Applied",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Setting avatar failed",
    });
  }
};

export default avatarUpload
