import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Spyderweb Studios",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {text: 'Plugin Documentation', items: [
      { text: 'Inventory Plugin', link: '/Plugin-Documentation/InventoryPlugin/index' },
      { text: 'Crafting Plugin', link: '/Plugin-Documentation/CraftingPlugin/index' },
      ] }
    ],

    sidebar: {
      '/Plugin-Documentation/InventoryPlugin/':[
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/Plugin-Documentation/InventoryPlugin/index' },
          { text: 'Quick Start Guide', link: '/Plugin-Documentation/InventoryPlugin/QuickSetup' },
        ]
      },
      {
        text: 'Components',
        items: [
          { text: 'Inventory Component', link: '/Plugin-Documentation/InventoryPlugin/Components/InventoryComponent' },
          { text: 'Interaction Component', link: '/Plugin-Documentation/InventoryPlugin/Components/InteractionComponent' },
          { text: 'Item Component', link: '/Plugin-Documentation/InventoryPlugin/Components/ItemComponent' },
        //  { text: 'Interaction Component', link: '/InventoryPlugin/Components/InteractionComponent' }
        ]
      },
      {
        text: 'Interfaces',
        items: [
         { text: 'Inventory Item Interface', link: '/Plugin-Documentation/InventoryPlugin/Interfaces/InventoryItemInterface' },
          { text: 'Interaction Interface', link: '/Plugin-Documentation/InventoryPlugin/Interfaces/InteractionInterface' }
        ]
      },
      {
        text: 'Structs',
        items: [
          { text: 'FInventoryArray Struct', link: '/Plugin-Documentation/InventoryPlugin/Structs/FInventoryArray' },
          { text: 'FInventorySlot Struct', link: '/Plugin-Documentation/InventoryPlugin/Structs/FInventorySlot' }
        ]
      },
      {
        text: 'Objects',
        items: [
          { text: 'Inventory Object', link: '/Plugin-Documentation/InventoryPlugin/Objects/InventoryObjectBase' },
        ]
      }

    ]},

    socialLinks: [
      { 
        icon: 'github', link: 'https://github.com/Spyderweb-Studios'
      },
      { 
        icon: 'discord', link: 'https://discord.gg/nz8dPgyKTQ' 
      },
      {
        icon: 'x', link: 'https://x.com/SpyderwebGames'
      },
      {
        icon: 'instagram', link: 'https://www.instagram.com/spyderwebstudios_official/'
      }
    ]
  }
})
