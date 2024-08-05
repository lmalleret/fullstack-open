import React from "react";
import blogService from "../services/blogs";

function NewBlogForm({blogs, setBlogs, handleSetNotification}) {
  const [newBlog, setNewBlog] = React.useState({
    title: "",
    author: "",
    url: "",
  });

  const handleSetNewBlog = (event) => {
    setNewBlog({ ...newBlog, [event.target.name]: event.target.value });
  };

  const submitNewBlog = async (event) => {
    event.preventDefault();
    try{
        const blogSave = await blogService.create(newBlog);
    setBlogs([...blogs, newBlog])
    setNewBlog({ title: "", author: "", url: "" });
    handleSetNotification({
        type: "success",
        message: "Success: Entrie created",
      });
    }catch(err){
        handleSetNotification({
            type: "error",
            message: "Error: Entrie could not be created",
          });
    }
  };

  return (
    <>
      <form onSubmit={submitNewBlog}>
        <div>
          <span>title: </span>
          <input
            type="text"
            name="title"
            value={newBlog.title}
            onChange={handleSetNewBlog}
          />
        </div>
        <div>
          <span>author: </span>
          <input
            type="text"
            name="author"
            value={newBlog.author}
            onChange={handleSetNewBlog}
          />
        </div>
        <div>
          {" "}
          <span>url: </span>
          <input
            type="text"
            name="url"
            value={newBlog.url}
            onChange={handleSetNewBlog}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
}

export default NewBlogForm;
