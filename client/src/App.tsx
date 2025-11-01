import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Questionnaires from "./pages/Questionnaires";
import AddQuestionnaire from "./pages/AddQuestionnaire";
import AddQuestionnaireKS from "./pages/AddQuestionnaireKS";
import EditQuestionnaire from "./pages/EditQuestionnaire";
import ViewQuestionnaireKS from "./pages/ViewQuestionnaireKS";
import PrintQuestionnaireKS from "./pages/PrintQuestionnaireKS";
import ReportsPage from "./pages/ReportsPage";
import AdminManagement from "./pages/AdminManagement";
// import Respondents from "./pages/Respondents"; // REMOVED - table deleted
import Login from "./pages/Login";
import { useAuthStore } from "./store/authStore";

function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          {/* Print route - standalone without layout */}
          <Route
            path="/questionnaires/print/:id"
            element={<PrintQuestionnaireKS />}
          />

          {/* Regular routes with layout */}
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  {/* <Route path="/respondents" element={<Respondents />} /> */}
                  <Route path="/questionnaires" element={<Questionnaires />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/admin" element={<AdminManagement />} />
                  <Route
                    path="/questionnaires/add"
                    element={<AddQuestionnaireKS />}
                  />
                  <Route
                    path="/questionnaires/add-old"
                    element={<AddQuestionnaire />}
                  />
                  <Route
                    path="/questionnaires/edit/:id"
                    element={<EditQuestionnaire />}
                  />
                  <Route
                    path="/questionnaires/edit-ks/:id"
                    element={<AddQuestionnaireKS />}
                  />
                  <Route
                    path="/questionnaires/view/:id"
                    element={<ViewQuestionnaireKS />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
