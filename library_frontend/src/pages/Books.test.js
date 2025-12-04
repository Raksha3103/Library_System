// src/pages/Books.test.js
jest.mock("axios");

import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import * as reactRouter from "react-router-dom";

// Component under test
import Books from "./Books";

// ----- Mock Redux actions -----
import { fetchBooks, fetchBookByName, getBooksOfAuthor, clearMessages } from "../slices/bookSlice";
import { logoutUser } from "../slices/loginSlice";

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...actual,
    useNavigate: jest.fn(),
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

jest.mock("../slices/bookSlice", () => ({
  fetchBooks: jest.fn(() => ({ type: "books/fetchBooks" })),
  fetchBookByName: jest.fn((name) => ({ type: "books/fetchBookByName", payload: name })),
  getBooksOfAuthor: jest.fn((name) => ({ type: "books/getBooksOfAuthor", payload: name })),
  clearMessages: jest.fn(() => ({ type: "books/clearMessages" })),
}));

jest.mock("../slices/loginSlice", () => ({
  logoutUser: jest.fn(() => ({ type: "login/logoutUser" })),
}));

// ----- Mock Store -----
const createMockStore = (initialState = {}) => ({
  getState: () => initialState,
  dispatch: jest.fn(),
  subscribe: jest.fn(),
});

// ----- Render helper -----
const renderWithProviders = (ui, { reduxState } = {}) => {
  const store = createMockStore(
    reduxState || {
      books: { list: [], errorMessage: null, successMessage: null },
      requests: { requests: [], notifications: [] }, // REQUIRED by Books.js
      login: { loggedInUser: {}, error: null }, // REQUIRED when logging out
    }
  );

  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    ),
    store,
  };
};

// ----------------- TESTS -----------------
describe("Books Component", () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    jest.spyOn(reactRouter, "useNavigate").mockImplementation(() => navigateMock);
    jest.clearAllMocks();
    localStorage.setItem("role", "User");
    localStorage.setItem("userId", "1");
  });

  test("renders search inputs and book container", () => {
    renderWithProviders(<Books />);
    expect(screen.getByPlaceholderText(/search by book name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search by author/i)).toBeInTheDocument();
    expect(screen.getByText(/library system/i)).toBeInTheDocument();
  });

  test("dispatches fetchBooks on mount", () => {
    const { store } = renderWithProviders(<Books />);
    expect(store.dispatch).toHaveBeenCalledWith(clearMessages());

    expect(fetchBooks).toHaveBeenCalled();
  });

  test("typing in book search dispatches fetchBookByName", async () => {
    renderWithProviders(<Books />);
    const input = screen.getByPlaceholderText(/search by book name/i);
    await userEvent.type(input, "React");
    await waitFor(() => {
      expect(fetchBookByName).toHaveBeenCalledWith("React");
    });
  });

  test("typing in author search dispatches getBooksOfAuthor", async () => {
    renderWithProviders(<Books />);
    const input = screen.getByPlaceholderText(/search by author/i);
    await userEvent.type(input, "John Doe");
    await waitFor(() => {
      expect(getBooksOfAuthor).toHaveBeenCalledWith("John Doe");
    });
  });

  test("logout button clears localStorage and navigates to login", async () => {
    renderWithProviders(<Books />);
    const button = screen.getByText(/logout/i);
    await userEvent.click(button);
    expect(logoutUser).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/login", { replace: true });
  });

  test("renders book cards from Redux store", () => {
    const books = [
      { bookId: 1, title: "React Basics", genre: "Programming", coverImage: "" },
      { bookId: 2, title: "Node.js Guide", genre: "Backend", coverImage: "" },
    ];

    renderWithProviders(<Books />, {
      reduxState: {
        books: { list: books, errorMessage: null, successMessage: null },
        requests: { requests: [], notifications: [] },
        login: { loggedInUser: {}, error: null },
      },
    });

    expect(screen.getByText("React Basics")).toBeInTheDocument();
    expect(screen.getByText("Node.js Guide")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /view details/i })).toHaveLength(2);
  });

  test("displays success and error messages from Redux store", () => {
    const reduxState = {
      books: {
        list: [],
        errorMessage: "Error fetching books",
        successMessage: "Books loaded successfully",
      },
      requests: { requests: [], notifications: [] },
      login: { loggedInUser: {}, error: null },
    };

    renderWithProviders(<Books />, { reduxState });

    expect(screen.getByText(/error fetching books/i)).toBeInTheDocument();

  });


});
