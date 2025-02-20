import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function App() {
    return (
        <Router>
            <Routes>
                {routes.map((route, index) => {
                    const Page = route.page;

                    // Kiểm tra nếu có route con
                    if (route.children) {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    route.isPrivate ? <PrivateRoute /> : <Page />
                                }
                            >
                                {route.children.map((child, childIndex) => {
                                    const ChildPage = child.page;
                                    return (
                                        <Route
                                            key={childIndex}
                                            path={child.path}
                                            element={
                                                child.isPrivate ? (
                                                    <PrivateRoute />
                                                ) : (
                                                    <ChildPage />
                                                )
                                            }
                                        />
                                    );
                                })}
                            </Route>
                        );
                    }

                    // Route không có route con
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                route.isPrivate ? <PrivateRoute /> : <Page />
                            }
                        />
                    );
                })}
            </Routes>
        </Router>
    );
}

export default App;
