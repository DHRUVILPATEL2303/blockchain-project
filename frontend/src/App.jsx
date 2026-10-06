import { Navigate, Route, Routes, useNavigate } from "react-router";
import Layout from "./components/Layout";
import { useContract } from "./hooks/useContract";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Identity from "./pages/Identity";
import Submissions from "./pages/Submissions";

function Protected({ children, contract }) {
  return contract ? children : <Navigate to="/" replace />;
}

export default function App() {
  const wallet = useContract();
  const navigate = useNavigate();

  const handleConnect = async () => {
    await wallet.connect();
    if (wallet.account) {
      navigate("/dashboard");
    }
  };

  const notice = wallet.notice
    ? {
        ...wallet.notice,
        onClose: () => wallet.setNotice(null),
      }
    : null;

  return (
    <Layout
      account={wallet.account}
      shortAccount={wallet.shortAccount}
      role={wallet.role}
      onConnect={handleConnect}
      onDisconnect={wallet.disconnect}
      address={wallet.address}
      busy={wallet.busy}
      notice={notice}
    >
      <Routes>
        <Route
          path="/"
          element={
            <Home
              address={wallet.address}
              onConnect={handleConnect}
              account={wallet.account}
              role={wallet.role}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Protected contract={wallet.contract}>
              <Dashboard {...wallet} />
            </Protected>
          }
        />
        <Route
          path="/submissions"
          element={
            <Protected contract={wallet.contract}>
              <Submissions {...wallet} />
            </Protected>
          }
        />
        {/* Only teacher/professor has access to Identity */}
        <Route
          path="/identity"
          element={
            <Protected contract={wallet.contract}>
              {wallet.role === "Professor" ? (
                <Identity contract={wallet.contract} />
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
