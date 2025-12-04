// src/pages/LoginForm.test.js
import '@testing-library/jest-dom';
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import * as reactRouter from "react-router-dom";

import LoginForm from "./LoginForm";
import { LoginUser } from "../slices/loginSlice";

// ----- Mock react-router-dom -----
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...actual,
    useNavigate: jest.fn(),
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

// ----- Mock LoginUser -----
jest.mock("../slices/loginSlice", () => ({
  LoginUser: jest.fn((data) => ({ type: "login/LoginUser", payload: data })),
}));

// ----- Mock store with dispatch -----
const createMockStore = (initialState = {}) => {
  const store = {
    getState: () => initialState,
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  };
  return store;
};

// ----- Helper to render component -----
const renderWithProviders = (ui, { reduxState } = {}) => {
  const store = createMockStore(reduxState || { login: { error: null, loggedInUser: null } });
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    ),
    store,
  };
};

// ---------------- TESTS ----------------
describe("LoginForm Component", () => {

  test("renders login form with email, password and login button", async () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    const button = await screen.findByRole("button", { name: /login/i });
    expect(button).toBeInTheDocument();

    expect(screen.getByText(/new user\?/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register here/i })).toBeInTheDocument();
  });

  test("allows user to type in email and password fields", async () => {
    renderWithProviders(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("dispatches LoginUser action on form submit", async () => {
  const store = createMockStore({ login: { error: null, loggedInUser: null } });

  // Spy on dispatch to intercept calls
  const dispatchSpy = jest.spyOn(store, "dispatch");

  render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </Provider>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "password123");

  const button = screen.getByRole("button", { name: /login/i });
  await userEvent.click(button);

  // Expect LoginUser to have been called
  expect(LoginUser).toHaveBeenCalledWith({
    email: "test@example.com",
    password: "password123",
  });

  // Optionally, check dispatch was called
  expect(dispatchSpy).toHaveBeenCalled();
});


  test("shows error message and clears form when login fails", () => {
    renderWithProviders(<LoginForm />, {
      reduxState: { login: { error: "Invalid credentials", loggedInUser: null } },
    });

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });

  test("navigates to home page on successful login", () => {
    const navigate = jest.fn();
    jest.spyOn(reactRouter, "useNavigate").mockImplementation(() => navigate);

    renderWithProviders(<LoginForm />, {
      reduxState: { login: { error: null, loggedInUser: { email: "user@test.com" } } },
    });

    expect(navigate).toHaveBeenCalledWith("/");
  });

  test("prefills form with initialData prop", () => {
    renderWithProviders(
      <LoginForm initialData={{ email: "prefill@test.com", password: "abc123" }} />
    );

    expect(screen.getByLabelText(/email/i)).toHaveValue("prefill@test.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("abc123");
  });

  test("clears error message after 1 second", async () => {
    jest.useFakeTimers();
    const { store } = renderWithProviders(<LoginForm />, {
      reduxState: { login: { error: "Login failed", loggedInUser: null } },
    });

    expect(screen.getByText(/login failed/i)).toBeInTheDocument();

    jest.advanceTimersByTime(1000);

    expect(store.dispatch).toHaveBeenCalledWith({ type: "login/clearLoginError" });

    jest.useRealTimers();
  });

  test("password input type is password", () => {
    renderWithProviders(<LoginForm />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("email input is required", () => {
    renderWithProviders(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute("required");
  });
});
