import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "./ui/navigation-menu";

export function NavBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-2">
        <NavigationMenuItem>
          <NavigationMenuLink
            className="block px-3 py-2 rounded-md hover:bg-accent"
            href="/"
          >
            Simulator
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className="block px-3 py-2 rounded-md hover:bg-accent"
            href="/about"
          >
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
