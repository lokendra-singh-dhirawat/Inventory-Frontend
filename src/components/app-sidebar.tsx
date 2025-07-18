import { Link } from "react-router";
import {
  Home,
  Settings,
  PlusCircle,
  LogIn,
  LogOut,
  Lock,
  X,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const appItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Create Game",
    url: "/create-game",
    icon: PlusCircle,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const authItems = [
  {
    title: "Login",
    url: "/login",
    icon: LogIn,
    requiresAuth: false,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
    requiresAuth: true,
  },
  {
    title: "Change Password",
    url: "/change-password",
    icon: Lock,
    requiresAuth: true,
  },
];

export function AppSidebar({ className }: { className?: string }) {
  const isAuthenticated = false;
  return (
    <>
      <Sidebar className={`${className || ""}`}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {appItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-6">
            <SidebarGroupLabel>Authentication</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {!isAuthenticated &&
                  authItems.find((item) => item.title === "Login") && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link
                          to={
                            authItems.find((item) => item.title === "Login")!
                              .url
                          }
                        >
                          <LogIn />
                          <span>Login</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                {isAuthenticated && (
                  <>
                    {authItems
                      .filter((item) => item.requiresAuth)
                      .map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link to={item.url}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                  </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Sheet>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar>
            <SidebarContent>
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <SheetTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </button>
                </SheetTrigger>
              </div>
              <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {appItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link to={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup className="mt-6">
                <SidebarGroupLabel>Authentication</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {!isAuthenticated &&
                      authItems.find((item) => item.title === "Login") && (
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <Link
                              to={
                                authItems.find(
                                  (item) => item.title === "Login"
                                )!.url
                              }
                            >
                              <LogIn />
                              <span>Login</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                    {isAuthenticated && (
                      <>
                        {authItems
                          .filter((item) => item.requiresAuth)
                          .map((item) => (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton asChild>
                                <Link to={item.url}>
                                  <item.icon />
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                      </>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SheetContent>
      </Sheet>
    </>
  );
}
