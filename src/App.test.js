import { render, screen } from "@testing-library/react";
import App from "./App";
import { validateEmail } from "./Utils";

// Mock the validateEmail function
jest.mock("./Utils", () => ({
  validateEmail: jest.fn(),
}));

describe("Sign Up Form", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("renders sign up form elements", () => {
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  test("shows password error message when password is less than 8 characters", () => {
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.blur(passwordInput);

    expect(
      screen.getByText(/password should have at least 8 characters/i)
    ).toBeInTheDocument();
  });

  test("does not show password error message when password is valid", () => {
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(passwordInput, { target: { value: "validPassword123" } });
    fireEvent.blur(passwordInput);

    expect(
      screen.queryByText(/password should have at least 8 characters/i)
    ).not.toBeInTheDocument();
  });

  test("submits form with valid data", () => {
    validateEmail.mockReturnValue(true); // Mock email validation to always return true

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "individual" },
    });

    window.alert = jest.fn(); // Mock alert

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(window.alert).toHaveBeenCalledWith("Account created!");
  });

  test("does not submit form with invalid data", () => {
    validateEmail.mockReturnValue(false); // Mock email validation to return false

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "role" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(window.alert).not.toHaveBeenCalled();
  });
});
