require("dotenv").config();
const AppError = require("../utils/AppError");
// const cloudinary = require("cloudinary").v2;

const Attachment = require("../models/Attachment");
const User = require("../models/User");
const Note = require("../models/Note");

//Temporary disable
//Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });

const linkAttachmentService = async (request, userId) => {
  const { noteId, fileUrl, fileType, fileSizeBytes } = request;

  const note = await Note.findByPk(noteId);
  if (!note) throw new AppError("Note is not found", 404);

  //   const publicId = fileUrl.substring(
  //     fileUrl.lastIndexOf("/") + 1,
  //     fileUrl.lastIndexOf("."),
  //   );
  const publicId = "test id"; //Temporary hard code set for test

  const newAttachment = await Attachment.create({
    noteId,
    fileUrl,
    externalId: publicId,
    fileType,
    fileSizeBytes,
  });

  return {
    id: newAttachment.id,
    fileUrl: newAttachment.fileUrl,
    fileType: newAttachment.fileType,
    fileSizeBytes: newAttachment.fileSizeBytes,
  };
};

const deleteAttchmentService = async (id, userId) => {
  const attachment = await Attachment.findByPk(id, {
    include: [
      {
        model: Note,
        attributes: ["userId"],
      },
    ],
  });
  if (!attachment) throw new AppError("Attachment is not found", 404);

  //Ownership check
  if (attachment.Note.userId !== userId)
    throw new AppError("Unauthorized user", 401);

  //Cloudinary deletion
  //   try {
  //     await cloudinary.uploader.destroy(attachment.externalId);
  //   } catch (error) {
  //     console.error("Cloudinary Error:", error);
  //     throw new AppError("Cloudinary deletion failed", 500);
  //   }

  await attachment.destroy();
};

module.exports = {
  linkAttachmentService,
  deleteAttchmentService,
};
