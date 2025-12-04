// src/pages/BookForm.test.js
import '@testing-library/jest-dom';

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BookForm from "./BookForm";
import * as bookSlice from "../slices/bookSlice";
import * as authorSlice from "../slices/authorSlice";

jest.mock("../slices/bookSlice", () => ({
  addBook: jest.fn(),
  updateBook: jest.fn(),
  fetchBookById: jest.fn(),
  clearMessages: jest.fn(),
}));

jest.mock("../slices/authorSlice", () => ({
  fetchAuthors: jest.fn(),
}));

// Mock Redux store
const createMockStore = (state = {}) => ({
  getState: () => state,
  dispatch: jest.fn(),
  subscribe: jest.fn(),
});

// Render helper
const renderWithStoreAndRouter = (ui, { reduxState, route = "/books/add" } = {}) => {
  const store = createMockStore(
    reduxState || {
      books: { list: [], selectedBook: null, successMessage: null, errorMessage: null },
      authors: { list: [] },
    }
  );

  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/books/add" element={ui} />
            <Route path="/books/edit/:id" element={ui} />
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
    store,
  };
};

describe("BookForm Behavior Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Add Book form correctly with empty fields", () => {
    renderWithStoreAndRouter(<BookForm />);
    expect(screen.getByText(/Add New Book/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title:/i)).toHaveValue("");
    expect(screen.getByLabelText(/Author:/i)).toHaveValue("");
    expect(screen.getByLabelText(/Genre:/i)).toHaveValue("");
    expect(screen.getByLabelText(/Total Copies:/i)).toHaveValue(null);
    expect(screen.getByLabelText(/Available Copies:/i)).toHaveValue(null);
    expect(screen.getByLabelText(/Published Date:/i)).toHaveValue("");
  });

  test("fetches authors on mount", () => {
    renderWithStoreAndRouter(<BookForm />);
    expect(authorSlice.fetchAuthors).toHaveBeenCalled();
  });

  test("updates form fields correctly when typing", async () => {
    renderWithStoreAndRouter(<BookForm />);
    const titleInput = screen.getByLabelText(/Title:/i);
    const genreInput = screen.getByLabelText(/Genre:/i);
    const totalCopiesInput = screen.getByLabelText(/Total Copies:/i);

    await userEvent.type(titleInput, "My Book");
    await userEvent.type(genreInput, "Fiction");
    await userEvent.type(totalCopiesInput, "5");

    expect(titleInput).toHaveValue("My Book");
    expect(genreInput).toHaveValue("Fiction");
    expect(totalCopiesInput).toHaveValue(5);
    expect(screen.getByLabelText(/Available Copies:/i)).toHaveValue(5); // auto sync
  });

 test("handles availableCopies adjustment correctly when totalCopies changes", async () => {
  renderWithStoreAndRouter(<BookForm />, {
    route: "/books/edit/1", // <-- edit mode
    reduxState: {
      books: { 
        selectedBook: { 
          bookId: 1,
          totalCopies: 5, 
          availableCopies: 3, 
          title: "Some Book", 
          genre: "Drama", 
          publishedDate: "2025-01-01", 
          authorId: 1 
        }, 
        list: [], 
        successMessage: null, 
        errorMessage: null 
      },
      authors: { list: [] },
    },
  });

  const totalCopiesInput = screen.getByLabelText(/Total Copies:/i);

  fireEvent.change(totalCopiesInput, { target: { value: 7 } });

  await waitFor(() => {
    expect(screen.getByLabelText(/Available Copies:/i)).toHaveValue(5);
  });
});

  test("submits Add Book form with valid data", async () => {
    const storeSpy = jest.fn();
    const finalReduxState = {
      books: { list: [], selectedBook: null, successMessage: null, errorMessage: null },
      authors: { list: [{ authorId: 1, fullName: "John Doe" }] },
    };

    renderWithStoreAndRouter(<BookForm />, { reduxState: finalReduxState });

    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: "Test Book" } });
    fireEvent.change(screen.getByLabelText(/Author:/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/Genre:/i), { target: { value: "Sci-Fi" } });
    fireEvent.change(screen.getByLabelText(/Total Copies:/i), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText(/Published Date:/i), { target: { value: "2025-01-01" } });

    fireEvent.click(screen.getByRole("button", { name: /Add Book/i }));

    await waitFor(() => {
      expect(bookSlice.addBook).toHaveBeenCalledWith(expect.objectContaining({
        title: "Test Book",
        genre: "Sci-Fi",
        totalCopies: 3,
        availableCopies: 3,
        authorId: 1,
      }));
    });
  });

  test("prompts confirmation and updates book in edit mode", async () => {
    const mockConfirm = jest.spyOn(window, "confirm").mockImplementation(() => true);
    renderWithStoreAndRouter(<BookForm />, {
      route: "/books/edit/5",
      reduxState: {
        books: { selectedBook: { bookId: 5, title: "Old Book", genre: "Drama", totalCopies: 2, availableCopies: 2, authorId: 1, publishedDate: "2023-01-01" }, list: [], successMessage: null, errorMessage: null },
        authors: { list: [{ authorId: 1, fullName: "John Doe" }] },
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update Book/i }));

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalled();
      expect(bookSlice.updateBook).toHaveBeenCalledWith(expect.objectContaining({ id: "5", book: expect.any(Object) }));
    });
  });

  test("does not submit if update confirmation is cancelled", async () => {
    const mockConfirm = jest.spyOn(window, "confirm").mockImplementation(() => false);
    renderWithStoreAndRouter(<BookForm />, {
      route: "/books/edit/5",
      reduxState: {
        books: { selectedBook: { bookId: 5, title: "Old Book", genre: "Drama", totalCopies: 2, availableCopies: 2, authorId: 1, publishedDate: "2023-01-01" }, list: [], successMessage: null, errorMessage: null },
        authors: { list: [{ authorId: 1, fullName: "John Doe" }] },
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update Book/i }));

    await waitFor(() => {
      expect(bookSlice.updateBook).not.toHaveBeenCalled();
    });
  });

  test("displays success and error messages", async () => {
    renderWithStoreAndRouter(<BookForm />, {
      reduxState: {
        books: { selectedBook: null, list: [], successMessage: "Success!", errorMessage: "Error occurred" },
        authors: { list: [] },
      },
    });

    expect(screen.getByText("Success!")).toBeInTheDocument();
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });
});
