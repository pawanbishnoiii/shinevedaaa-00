import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { 
  Home, 
  Package, 
  ShoppingBag, 
  Tags, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  FileText, 
  Heart, 
  Image, 
  Globe,
  Layout,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  LogOut,
  BookOpen,
  Mail,
  Send
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar-new"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const navigation = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        icon: Home,
        url: "/admin",
      },
      {
        title: "Dashboard",
        icon: BarChart3,
        url: "/admin/dashboard",
      },
      {
        title: "Analytics",
        icon: BarChart3,
        url: "/admin/analytics",
        badge: "New",
      },
    ],
  },
  {
    title: "Products & Catalog",
    items: [
      {
        title: "Products",
        icon: Package,
        url: "/admin/products",
        subItems: [
          { title: "All Products", url: "/admin/products" },
          { title: "Featured Products", url: "/admin/featured-products" },
          { title: "Add Product", url: "/admin/products/new" },
        ],
      },
      {
        title: "Categories",
        icon: Tags,
        url: "/admin/categories",
      },
    ],
  },
  {
    title: "Content Management",
    items: [
      {
        title: "Content Blocks",
        icon: Layout,
        url: "/admin/content",
      },
      {
        title: "Footer Pages",
        icon: FileText,
        url: "/admin/footer-pages",
        badge: "New",
      },
      {
        title: "Indian Farmers Portfolio",
        icon: Globe,
        url: "/admin/indian",
        subItems: [
          { title: "Farmer Stories", url: "/admin/indian-farmers" },
          { title: "Regional Crops", url: "/admin/rajasthan-crops" },
        ],
      },
      {
        title: "Agri Content",
        icon: Globe,
        url: "/admin/agri",
        subItems: [
          { title: "Crop Portfolio", url: "/admin/crop-portfolio" },
          { title: "Farmer Stories", url: "/admin/farmer-stories" },
          { title: "Agri Blog", url: "/admin/agri-blog" },
          { title: "Gallery Management", url: "/admin/gallery-management" },
        ],
      },
    ],
  },
  {
    title: "Email Marketing",
    items: [
      {
        title: "Email Subscribers",
        icon: Users,
        url: "/admin/email-subscribers",
        badge: "New",
      },
      {
        title: "Email Campaigns",
        icon: Send,
        url: "/admin/email-campaigns",
        badge: "New",
      },
      {
        title: "Email Templates",
        icon: Mail,
        url: "/admin/email-templates",
        badge: "New",
      },
    ],
  },
  {
    title: "Customer Relations",
    items: [
      {
        title: "Inquiries",
        icon: MessageSquare,
        url: "/admin/inquiries",
        badge: "12",
      },
      {
        title: "Testimonials",
        icon: Heart,
        url: "/admin/testimonials",
      },
      {
        title: "Favorites",
        icon: Heart,
        url: "/admin/favorites",
      },
    ],
  },
  {
    title: "Settings & Tools",
    items: [
      {
        title: "Settings",
        icon: Settings,
        url: "/admin/settings",
      },
      {
        title: "SEO Tools",
        icon: Search,
        url: "/admin/seo",
        badge: "Enhanced",
      },
    ],
  },
]

export function AdminSidebar() {
  const location = useLocation()
  const { state } = useSidebar()
  const [openGroups, setOpenGroups] = useState<string[]>(["Dashboard", "Products & Catalog", "Content Management"])

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(g => g !== groupTitle)
        : [...prev, groupTitle]
    )
  }

  const isActive = (url: string) => {
    if (url === "/admin" && location.pathname === "/admin") return true
    if (url === "/admin/dashboard" && location.pathname === "/admin/dashboard") return true
    return location.pathname.startsWith(url) && url !== "/admin"
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <ShoppingBag className="h-6 w-6 text-primary-foreground" />
          </div>
          {state === "expanded" && (
            <div className="flex flex-col">
              <h2 className="font-bold text-lg">ShineVeda</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Quick Search - Only show when expanded */}
        {state === "expanded" && (
          <div className="px-2 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Quick search..." 
                className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>
          </div>
        )}

        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <Collapsible
              open={state === "collapsed" || openGroups.includes(group.title)}
              onOpenChange={() => state === "expanded" && toggleGroup(group.title)}
            >
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="group/label flex w-full items-center justify-between hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1">
                  <span className="font-medium">{group.title}</span>
                  {state === "expanded" && (
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/label:rotate-180" />
                  )}
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        {item.subItems ? (
                          <Collapsible defaultOpen={isActive(item.url)}>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                tooltip={item.title}
                                isActive={isActive(item.url)}
                                className="group/item"
                              >
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                                {item.badge && (
                                  <Badge variant="secondary" className="ml-auto text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                                <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/item:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.subItems.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={location.pathname === subItem.url}
                                    >
                                      <Link to={subItem.url}>
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </Collapsible>
                        ) : (
                          <SidebarMenuButton
                            asChild
                            tooltip={item.title}
                            isActive={isActive(item.url)}
                          >
                            <Link to={item.url}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                              {item.badge && (
                                <Badge 
                                  variant={
                                    item.badge === "New" ? "default" : 
                                    item.badge === "Enhanced" || item.badge === "Upgraded" ? "secondary" : 
                                    "outline"
                                  } 
                                  className="ml-auto text-xs"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AD
                </AvatarFallback>
              </Avatar>
              {state === "expanded" && (
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium">Admin User</span>
                  <span className="text-xs text-muted-foreground">bnoy.studios@gmail.com</span>
                </div>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Notifications">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
              <Badge variant="destructive" className="ml-auto text-xs">3</Badge>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}