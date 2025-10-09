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
      { text: 'Game State Machine Plugin', link: '/Plugin-Documentation/GameStateMachinePlugin/index' }
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

    ],

    '/Plugin-Documentation/GameStateMachinePlugin/':[

      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/Plugin-Documentation/GameStateMachinePlugin/index' },
          { text: 'Quick Start Guide', link: '/Plugin-Documentation/GameStateMachinePlugin/QuickSetup' },
        ]
      },
      {
        text: 'Blueprint Nodes',
        items: [
          { text: 'Attempt State Transition', link: '/Plugin-Documentation/GameStateMachinePlugin/K2Nodes/AttemptTransitionProxy' },
        ]
      },

      {
        text: 'Components',
        items: [
          { text: 'Game State Machine Component', link: '/Plugin-Documentation/GameStateMachinePlugin/Components/GameStateManagerComponent' },
        ]
      },      
      {
        text: 'Interfaces', 
        items: [
          { text: 'Root State Interfaces', link: '/Plugin-Documentation/GameStateMachinePlugin/Interfaces/RootStateInterfaces' },
        ]
      },
      {
        text: 'Objects',
        items: [
          { text: 'State Object', link: '/Plugin-Documentation/GameStateMachinePlugin/Objects/StateObject' },
          { text: 'Leaf State Object', link: '/Plugin-Documentation/GameStateMachinePlugin/Objects/LeafStateObject' },
          { text: 'Root State Object', link: '/Plugin-Documentation/GameStateMachinePlugin/Objects/RootStateObject' },
          { text: 'Root State Object - Nested', link: '/Plugin-Documentation/GameStateMachinePlugin/Objects/RootStates/RootStateObject_Nested'},
          { text: 'Root State Object - Tags', link: '/Plugin-Documentation/GameStateMachinePlugin/Objects/RootStates/RootStateObject_Tag' }
        ]
      },
      {
        text: 'Enum',
        items: [
          { text: 'EStateFlag Enum', link: '/Plugin-Documentation/GameStateMachinePlugin/Enums/EStateFlags' }
        ]
      }
    ]
    },
  
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
