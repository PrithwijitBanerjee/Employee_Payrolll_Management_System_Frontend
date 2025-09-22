import { ErrorBoundary } from "react-error-boundary";
import "./App.css";
import Error from "@/views/Error/Error";
import ProjectRoutes from "@/routes/ProjectRoutes";

function App() {

  return (
    <>
      <ErrorBoundary FallbackComponent={Error}>
        <ProjectRoutes />
      </ErrorBoundary>
    </>
  );
}

export default App;
