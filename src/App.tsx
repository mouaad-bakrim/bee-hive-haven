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
const Community = lazy(() => import("./pages/Community"));
const TagPage = lazy(() => import("./pages/TagPage"));
const Glossary = lazy(() => import("./pages/Glossary"));
const BeekeepingCalendar = lazy(() => import("./pages/BeekeepingCalendar"));
const AuthorPage = lazy(() => import("./pages/AuthorPage"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const PostsList = lazy(() => import("./pages/admin/PostsList"));
const PostEditor = lazy(() => import("./pages/admin/PostEditor"));
const MediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Comments = lazy(() => import("./pages/admin/Comments"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const UsersPage = lazy(() => import("./pages/admin/Users"));
const Notifications = lazy(() => import("./pages/admin/Notifications"));
const Subscribers = lazy(() => import("./pages/admin/Subscribers"));
const AdminCommunity = lazy(() => import("./pages/admin/AdminCommunity"));

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
              <Route element={<Layout><Community /></Layout>} path="/communaute" />
              <Route element={<Layout><TagPage /></Layout>} path="/tag/:slug" />
              <Route element={<Layout><Glossary /></Layout>} path="/glossaire" />
              <Route element={<Layout><BeekeepingCalendar /></Layout>} path="/calendrier" />
              <Route element={<Layout><AuthorPage /></Layout>} path="/auteur/:id" />
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
                <Route path="analytics" element={<Analytics />} />
                <Route path="comments" element={<Comments />} />
                <Route path="categories" element={<Categories />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="subscribers" element={<Subscribers />} />
                <Route path="communaute" element={<AdminCommunity />} />
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
