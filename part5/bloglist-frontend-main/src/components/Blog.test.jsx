import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

beforeEach(() => {
  const user = {
    id: "1",
    name: "Luciano Malleret",
    username: "luchanga321",
  };
  window.localStorage.setItem("user", JSON.stringify(user));
});

test("renders blog title and author only", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Luciano Malleret",
    url: "http://youtube.com.ar",
    likes: 1000,
    user: {
      id: "1",
      name: "Luciano Malleret",
      username: "luchanga321",
    },
  };

  const { container } = render(<Blog blog={blog} />);

  const div = container.querySelector(".blog");
  expect(div).toBeInTheDocument();

  expect(div).toHaveTextContent(
    "Component testing is done with react-testing-library"
  );
  expect(div).toHaveTextContent("Luciano Malleret");

  const toggable = container.querySelector(".togglableContent");
  expect(toggable).toBeInTheDocument();
  expect(toggable).toHaveStyle("display: none");
});