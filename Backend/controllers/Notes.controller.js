import Note from "../models/Note.model.js";

export const createNote = async (req,res,next) => {
  try{
    const note = await Note.create({ ...req.body, user: req.user.id });
    res.status(201).json(note);
  }catch(err){ next(err); }
};

export const getNotes = async (req,res,next) => {
  try{
    const { q, tag } = req.query;
    const filter = { user: req.user.id };
    if(q) filter.$or = [{ title: new RegExp(q, "i") }, { content: new RegExp(q, "i") }];
    if(tag) filter.tags = tag;
    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  }catch(err){ next(err); }
};

export const getNote = async (req,res,next) => {
  try{
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if(!note) return res.status(404).json({ message: "Not found" });
    res.json(note);
  }catch(err){ next(err); }
};

export const updateNote = async (req,res,next) => {
  try{
    const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true });
    if(!note) return res.status(404).json({ message: "Not found" });
    res.json(note);
  }catch(err){ next(err); }
};

export const deleteNote = async (req,res,next) => {
  try{
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if(!note) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  }catch(err){ next(err); }
};
