const loginWith = async (page, username, password) => {
  await page.getByRole("textbox").first().fill(username);
  await page.getByRole("textbox").last().fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, blog) => {
  await page.getByRole("button", { name: "new blog" }).click();
  const textboxes = await page.getByRole("textbox").all();
  await textboxes[0].fill(blog.title);
  await textboxes[1].fill(blog.author);
  await textboxes[2].fill(blog.url);
  await page.getByRole("button", { name: "create" }).click();
  await page.getByText("Success: Entrie created").waitFor();
  await page.getByRole("button", { name: "cancel" }).click();
};

export { loginWith, createBlog };
