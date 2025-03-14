import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context"
import { EUserRole } from "@/enum";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user} = useAuth();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <p className="text-xl font-bold">Quiz App</p>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {
              user?.role === EUserRole.Admin ? (
              <SidebarMenuItem>
                <a href="/questions">Questions</a>
              </SidebarMenuItem>
              ): (
              <SidebarMenuItem>
                <a href="/answers">Answers</a>
              </SidebarMenuItem>
              )
            }
            
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
