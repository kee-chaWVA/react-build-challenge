import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react"
import { clearSession, getSession, storeSession } from "./session";
import { AuthProvider, useAuth } from "./AuthContext"
import { createToken, clearToken, storeToken } from "./token";
import { AUTH_LOGOUT_EVENT } from "./event";
import { getRecord } from "../data/appDb";
import Button from "../components/Button";
import type { User } from "../types/user";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";
import { resetTwoFactor } from "../features/security/securitySlice";

vi.mock("./session", () => ({
  getSession: vi.fn(),
  storeSession: vi.fn(),
  clearSession: vi.fn()
}))

vi.mock("./token", () => ({
  createToken: vi.fn(),
  storeToken: vi.fn(),
  clearToken: vi.fn()
}))

vi.mock("./event", () => ({
  AUTH_LOGOUT_EVENT: 'auth:logout'
}))

vi.mock("../data/appDb", () => ({
  getRecord: vi.fn(),
  STORES: {
    USERS: "users"
  }
}))

const mockDispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch
}))

const mockUser: User = {
  id: crypto.randomUUID(),
  userName: 'test@testemail.com',
  firstName: 'Test',
  lastName: 'User',
  passwordDigest: 'fake-hash'
}

function TestComponent() {
  const {login, isAuthenticated } = useAuth()
  return (
    <>
      <Button
        onClick={() => login(mockUser)}>
        Login
      </Button>
      <div>
        {isAuthenticated ? "Logged In" : "Logged Out"}
      </div>
    </>
  )
}

function TestLogoutComponent() {
  const {logout, isAuthenticated } = useAuth()
  return(
    <>
      <Button
        onClick={() => logout()}>
        Logout
      </Button>
      <div>
        {isAuthenticated ? "Logged In" : "Logged Out"}
      </div>
    </>
  )
}

describe("AuthContext", () => {
  it("starts unauthenticated when no session exist?", async () => {
    vi.mocked(getSession).mockReturnValue(null)
    render(
      <AuthProvider>
        <TestComponent/>
      </AuthProvider>
    )

    expect(
      screen.getByText("Logged Out")
    ).toBeInTheDocument()
  })

  it("logs in a user", async () => {
    const mockToken = crypto.randomUUID();
    vi.mocked(createToken).mockReturnValue(mockToken);
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent/>
      </AuthProvider>
    );

    expect(
      screen.getByText('Logged Out')
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button',{
        name: /login/i
      })
    );

    expect(
      screen.getByText('Logged In')
    ).toBeInTheDocument();

    expect(storeSession).toHaveBeenCalledWith(mockUser.id);
    expect(storeToken).toHaveBeenCalledWith(mockToken);
  })

  it('logs out a user', async () => {
    const user = userEvent.setup();
    vi.mocked(getSession).mockReturnValue(mockUser.id);
    vi.mocked(getRecord).mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestLogoutComponent/>
      </AuthProvider>
    );

    expect(
      await screen.findByText("Logged In")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: /logout/i
      })
    );

    expect(
      screen.getByText('Logged Out')
    ).toBeInTheDocument();

    expect(clearSession).toHaveBeenCalled();
    expect(clearToken).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      resetTwoFactor()
    );
  })

  it("logs out when AUTH_LOGOUT_EVENT is triggered", async () => {
    vi.mocked(getSession).mockReturnValue(mockUser.id);
    vi.mocked(getRecord).mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestLogoutComponent/>
      </AuthProvider>
    )

    expect(
      await screen.findByText(/logged in/i)
    ).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(
        new Event(AUTH_LOGOUT_EVENT)
      )
    })

    expect(
      screen.getByText(/logged out/i)
    ).toBeInTheDocument();

    expect(clearSession).toHaveBeenCalled();
    expect(clearToken).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      resetTwoFactor()
    );
  })
})