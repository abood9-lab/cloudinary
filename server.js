const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

const app = express();
const PORT = 3000;

// تفعيل الـ CORS لتسمح لملف الـ HTML الخارجي بطلب البيانات بدون حظر
app.use(cors());

// إعدادات الاتصال بحسابك في Cloudinary
cloudinary.config({
  cloud_name: 'dt5pdj978',
  api_key: '957489226295958', // الـ API Key الخاص بك (تأكد منه من الـ Dashboard)
  api_secret: 'kueM1BLX6rrIeuQXSXQTobvmP9w', // ⚠️ ضع الـ API Secret الخاص بك هنا
  secure: true
});

// الـ Endpoint التي سيطلبها موقعك لجلب الروابط
app.get('/api/images', async (req, res) => {
  try {
    // جلب الملفات من كلووديناري (الحد الأقصى 500 صورة في الطلب الواحد)
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: '', // اتركها فارغة لجلب كل الصور، أو حدد مجلد معين مثل 'gallery/'
      max_results: 500 
    });

    // استخراج الروابط الأساسية والمعلومات المهمة فقط
    const images = result.resources.map(file => ({
      public_id: file.public_id,
      version: file.version,
      format: file.format
    }));

    // إرسال المصفوفة إلى الـ Frontend
    res.json({ success: true, images: images });

  } catch (error) {
    console.error("حدث خطأ في السيرفر:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`السيرفر يعمل بنجاح على الرابط: http://localhost:${PORT}`);
});