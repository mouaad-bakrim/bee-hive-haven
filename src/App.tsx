import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const ArticlePage = lazy(() => import("./pages/Article"));
const CategoryPage = lazy(() => import("./pages/Category"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Search = lazy(() => import("./pages/Search"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const PostsList = lazy(() => import("./pages/admin/PostsList"));
const PostEditor = lazy(() => import("./pages/admin/PostEditor"));
const MediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route element={<Layout><Index /></Layout>} path="/" />
              <Route element={<Layout><ArticlePage /></Layout>} path="/article/:slug" />
              <Route element={<Layout><CategoryPage /></Layout>} path="/categorie/:slug" />
              <Route element={<Layout><About /></Layout>} path="/a-propos" />
              <Route element={<Layout><Contact /></Layout>} path="/contact" />
              <Route element={<Layout><Privacy /></Layout>} path="/confidentialite" />
              <Route element={<Layout><Search /></Layout>} path="/recherche" />
              <Route path="/login" element={<Login />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="posts" element={<PostsList />} />
                <Route path="posts/new" element={<PostEditor />} />
                <Route path="posts/:id/edit" element={<PostEditor />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
