import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Posts from "./pages/Posts";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import EventGallery from "./pages/EventGallery";
import Contribute from "./pages/Contribute";
import AdminLogin from "./pages/AdminLogin";
import CoupleDashboard from "./pages/CoupleDashboard";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/products"} component={Products} />
          <Route path={"/posts"} component={Posts} />
          <Route path={"/admin"}>
            {() => (
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            )}
          </Route>
          <Route path={"/gallery"}>
            {() => (
              <ProtectedRoute requiredRole="admin">
                <EventGallery />
              </ProtectedRoute>
            )}
          </Route>
          <Route path={"/checkout"} component={Checkout} />
          <Route path={"/checkout/success"} component={CheckoutSuccess} />
          <Route path={"/checkout/cancel"} component={CheckoutCancel} />

          <Route path={"/contribute"} component={Contribute} />
          <Route path={"/admin-login"} component={AdminLogin} />
          <Route path={"/dashboard"} component={CoupleDashboard} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
