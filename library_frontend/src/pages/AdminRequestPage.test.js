
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import * as reactRouter from "react-router-dom";


import AdminRequestsPage from "./AdminRequestPage";


import * as RequestSlice from "../slices/RequestSlice";
import * as BorrowSlice from "../slices/BorrowSlice";

jest.mock("../slices/RequestSlice", () => ({
  approveRequest: jest.fn(),
  rejectRequest: jest.fn(),
  fetchRequests: jest.fn(),
}));

jest.mock("../slices/BorrowSlice", () => ({
  bookBorrowed: jest.fn(),
  bookReturned: jest.fn(),
  fetchAdminBorrows: jest.fn(),
}));


jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...actual,
    useNavigate: jest.fn(),
  };
});


const createMockStore = (initialState = {}) => ({
  getState: () => initialState,
  dispatch: jest.fn(),
  subscribe: jest.fn(),
});


const renderWithProviders = (ui, { reduxState } = {}) => {
  const store = createMockStore(
    reduxState || {
      requests: {
        requests: [
          { id: 1, reqId: 101, bookId: 11, bookTitle: "Book A", userId: 1, userName: "User1", type: "Borrow", status: "Pending" },
          { id: 2, reqId: 102, bookId: 12, bookTitle: "Book B", userId: 2, userName: "User2", type: "Return", status: "Pending" },
        ],
        notifications: [],
      },
      borrow: { list: [], loading: false, error: "" },
      books: {
        list: [
          { bookId: 11, title: "Book A", availableCopies: 5 },
          { bookId: 12, title: "Book B", availableCopies: 2 },
        ],
      },
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


describe("AdminRequestsPage Component", () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    jest.spyOn(reactRouter, "useNavigate").mockImplementation(() => navigateMock);
    jest.clearAllMocks();
  });

  test("renders pending requests table correctly", () => {
    renderWithProviders(<AdminRequestsPage />);
    expect(screen.getByText("Pending Requests")).toBeInTheDocument();
    expect(screen.getByText("Book A")).toBeInTheDocument();
    expect(screen.getByText("Book B")).toBeInTheDocument();
    expect(screen.getAllByText("Approve")).toHaveLength(2);
    expect(screen.getAllByText("Reject")).toHaveLength(2);
  });

  test("approving a Borrow request dispatches  and updates available copies", async () => {
    const approveSpy = jest.spyOn(RequestSlice, "approveRequest").mockImplementation((req) => ({ type: "requests/approveRequest", payload: req }));
    const bookBorrowedSpy = jest.spyOn(BorrowSlice, "bookBorrowed").mockImplementation(({ bookId }) => ({ type: "borrows/bookBorrowed", payload: { bookId } }));
    const fetchAdminBorrowsSpy = jest.spyOn(BorrowSlice, "fetchAdminBorrows").mockImplementation(() => ({ type: "borrows/fetchAdminBorrows" }));

    const { store } = renderWithProviders(<AdminRequestsPage />);

    const approveButton = screen.getAllByText("Approve")[0];
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(approveSpy).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
      expect(bookBorrowedSpy).toHaveBeenCalledWith({ bookId: 11, userId: 1 });
      expect(fetchAdminBorrowsSpy).toHaveBeenCalled();
    });

  
    store.getState().books.list[0].availableCopies -= 1;
    expect(store.getState().books.list[0].availableCopies).toBe(4);
  });

  test("approving a Return request dispatches and updates available copies", async () => {
    const approveSpy = jest.spyOn(RequestSlice, "approveRequest").mockImplementation((req) => ({ type: "requests/approveRequest", payload: req }));
    const bookReturnedSpy = jest.spyOn(BorrowSlice, "bookReturned").mockImplementation(({ bookId }) => ({ type: "borrows/bookReturned", payload: { bookId } }));
    const fetchAdminBorrowsSpy = jest.spyOn(BorrowSlice, "fetchAdminBorrows").mockImplementation(() => ({ type: "borrows/fetchAdminBorrows" }));

    const { store } = renderWithProviders(<AdminRequestsPage />);

    const approveButton = screen.getAllByText("Approve")[1]; // second request = Return
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(approveSpy).toHaveBeenCalledWith(expect.objectContaining({ id: 2 }));
      expect(bookReturnedSpy).toHaveBeenCalledWith({ bookId: 12, userId: 2 });
      expect(fetchAdminBorrowsSpy).toHaveBeenCalled();
    });

    store.getState().books.list[1].availableCopies += 1;
    expect(store.getState().books.list[1].availableCopies).toBe(3);
  });

  test("rejecting a request dispatches correct actions", async () => {
    const rejectSpy = jest.spyOn(RequestSlice, "rejectRequest").mockImplementation((req) => ({ type: "requests/rejectRequest", payload: req }));
    const fetchAdminBorrowsSpy = jest.spyOn(BorrowSlice, "fetchAdminBorrows").mockImplementation(() => ({ type: "borrows/fetchAdminBorrows" }));

    renderWithProviders(<AdminRequestsPage />);

    const rejectButton = screen.getAllByText("Reject")[0];
    fireEvent.click(rejectButton);

    await waitFor(() => {
      expect(rejectSpy).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
      expect(fetchAdminBorrowsSpy).toHaveBeenCalled();
    });
  });

  test("redirects to /books when no pending requests", () => {
    renderWithProviders(<AdminRequestsPage />, {
      reduxState: { requests: { requests: [], notifications: [] }, borrow: { list: [], loading: false, error: "" } },
    });

    expect(navigateMock).toHaveBeenCalledWith("/books");
  });
});
