const { test, expect, beforeEach, describe } = require("@playwright/test");
const testHelper = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3001/api/testing/reset");
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "user test",
        username: "user",
        password: "user",
      },
    });
    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    const locator = await page.getByText("Log in to application");
    await expect(locator).toBeVisible();
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await testHelper.loginWith(page, "mluukkai", "salainen");

      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await testHelper.loginWith(page, "mluukkai", "wrong");

      await expect(page.getByText("wrong credentials")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await testHelper.loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      await testHelper.createBlog(page, {
        title: "mluukkai blog",
        author: "Matti Luukkainen",
        url: "http://test-url.com",
      });
      await expect(
        page.getByText("mluukkai blog Matti Luukkainen")
      ).toBeVisible();
    });

    test("user can delete his blogs", async ({ page }) => {
      page.on("dialog", async (dialog) => {
        await dialog.accept(); // Acepta el diálogo
      });
      await testHelper.createBlog(page, {
        title: "blog that is going to be deleted",
        author: "Matti Luukkainen",
        url: "http://test-url.com",
      });
      await expect(
        page.getByText("blog that is going to be deleted")
      ).toBeVisible();
      await page.getByRole("button", { name: "show" }).click();
      await page.getByRole("button", { name: "remove" }).click();
      await expect(
        page.getByText("blog that is going to be deleted Matti Luukkainen")
      ).not.toBeVisible();
    });
    test("user cant delete others blogs posted", async ({ page }) => {
      await testHelper.createBlog(page, {
        title: "mluukkai blog",
        author: "Matti Luukkainen",
        url: "http://test-url.com",
      });
      await page.getByRole("button", { name: "logout" }).click();
      await testHelper.loginWith(page, "user", "user");
      await expect(
        page.getByText("mluukkai blog Matti Luukkainen")
      ).toBeVisible();
      await page.getByRole("button", { name: "show" }).click();
      await expect(
        page.getByRole("button", { name: "remove" })
      ).not.toBeVisible();
    });
    test("blogs are ordered by like count asc", async ({ page }) => {
      // Crea los blogs
      await testHelper.createBlog(page, {
        title: "blog 1",
        author: "Matti Luukkainen",
        url: "http://test-url.com",
      });
      await testHelper.createBlog(page, {
        title: "blog 2",
        author: "Matti Luukkainen",
        url: "http://test-url.com",
      });

      // Verifica que ambos blogs estén visibles
      await expect(page.getByText("blog 1 Matti Luukkainen")).toBeVisible();
      await expect(page.getByText("blog 2 Matti Luukkainen")).toBeVisible();

      // Obtén todos los botones 'show' y haz clic en ellos para mostrar los blogs
      let showButtons = await page.getByRole("button", { name: "show" }).all();
      if (showButtons.length === 0) {
        throw new Error("No show buttons found");
      }
      await showButtons[0].click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "hide" }).click();

      await showButtons[1].click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "hide" }).click();

      // Recarga la página para reflejar los cambios
      await page.reload();

      await page.waitForSelector('.blog');

      // Re-obtén los botones 'show' y haz clic en ellos para mostrar los blogs
      await page.getByRole("button", { name: "show" }).first().click();
      await page.getByRole("button", { name: "show" }).click();

      // Obtén los elementos que representan los blogs
      const blogElements = await page.locator(".blog");

      // Verifica si los elementos de los blogs tienen el texto 'likes:'
      const blogLikes = await blogElements.evaluateAll(blogs => {
    return blogs.map(blog => {
      const likesText = blog.querySelector('p')?.textContent || 'likes: 0';
      const match = likesText.match(/likes:\s*(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
  });

      // Verifica que los blogs estén ordenados por likes en orden ascendente
      expect(blogLikes).toEqual(blogLikes.slice().sort((a, b) => a - b));
    });
  });
});
