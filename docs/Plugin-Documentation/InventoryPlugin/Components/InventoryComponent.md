---
sidebar_label: 'Inventory Component'
sidebar_position: 3
---

# `UInventoryComponentBase`

> Base component responsible for managing **items**, **usage**, **transfer**, and **replication** in the Inventory System.

---

## Overview

The `UInventoryComponentBase` class handles all **core inventory logic** for adding, removing, using, transferring, and dropping items.
It ensures that all operations are **authority-validated** and **replicated** correctly across the network.

All externally accessible functions are **BlueprintCallable** and automatically perform server validation when called from clients.

---

## Network Behavior

All inventory actions follow this flow:

1. **Authority Check**
   If executed on a client, the function calls its **Server RPC** counterpart automatically.

2. **Validation**
   Ensures that the item is valid and implements `IInventoryItemInterface`.

3. **Execution**
   Calls the appropriate authority-only internal method (e.g., `AttemptAddItem`, `AttemptRemoveItem`).

---

## Inventory Workflow

### Adding Items

**Function:**

```cpp
bool AddItem(UObject* Item, int32 Quantity, int32& RemainingAmount);
```

**Description:**
Attempts to add an item to the inventory while performing authority and validity checks.

**Authority Chain:**

```
AddItem → AttemptAddItem → Server_AddItem
```

**Related Interface Function:**
`IInventoryItemInterface::CanBeAddedToInventory()`

**Blueprint Events & Delegates:**

* `K2_OnItemAdded`
* `OnItemChanged_Delegate`



---

### Removing Items

**Functions:**

```cpp
bool RemoveItem(UObject* Item, int32 Quantity, int32& RemainingAmount);
bool RemoveItemAtIndex(int32 Index, int32 Quantity, int32& RemainingAmount, bool bUseLocalIndex);
```

**Description:**
Removes an item or quantity from the inventory by object or slot.

**Related Interface Function:**
`IInventoryItemInterface::CanBeRemovedFromInventory()`

**Blueprint Events & Delegates:**

* `K2_OnItemRemovedFromInventory`
* `OnItemRemovedFromInventoryDelegate`

---

### Using Items

**Functions:**

```cpp
bool UseItem(UObject* Item, int32 Quantity);
bool UseItemAtIndex(int32 Index, int32 Quantity, bool bUseLocalIndex);
```

**Description:**
Uses an item, triggering its custom `OnUse` logic.

**Related Interface Function:**
`IInventoryItemInterface::CanBeUsed()`

**Example Flow:**

1. Validate authority and item.
2. Check that the Item can be used via `IInventoryItemInterface::CanBeUsed()`
3. Call the item’s `OnUse` implementation.
4. Update inventory if necessary (e.g., consume item).

---

### Transferring Items

**Functions:**

```cpp
bool TransferItem(UObject* Item, int32 Quantity, UInventoryComponentBase* TargetInventory);
bool TransferItemAtIndex(int32 Index, int32 Quantity, UInventoryComponentBase* TargetInventory, bool bUseLocalIndex);
```

**Description:**
Transfers items from one inventory to another with validation and replication.

**Related Interface Function:**
`IInventoryItemInterface::CanBeTransferred()`

---

### Dropping Items

**Functions:**

```cpp
bool DropItem(UObject* Item, int32 Quantity);
bool DropItemAtIndex(int32 Index, int32 Quantity, bool bUseLocalIndex);
```

**Description:**
Drops items into the world or environment, triggering the item’s drop logic.

**Related Interface Function:**
`IInventoryItemInterface::CanBeDropped()`

**Item Callback:**

```cpp
void OnDrop(UInventoryComponentBase* InventoryComponent, int Quantity);
```

---

## Utility Functions

| Function                        | Description                                                      |
| ------------------------------- | ---------------------------------------------------------------- |
| `GetFreeSlot()`                 | Returns the first empty slot index.                              |
| `GetItemAtIndex(int32 Index)`   | Returns the `UObject*` stored in a slot.                         |
| `GetServerIndex(int32 Index)`   | Converts a client-local index to the authoritative server index. |
| `GetInventorySlot(int32 Index)` | Returns an `FInventorySlot` struct at the given index.           |

---

## Replication

| Property        | Type              | Description                                                |
| --------------- | ----------------- | ---------------------------------------------------------- |
| `Inventory`     | `FInventoryArray` | Replicated array containing all inventory slots and items. |
| `InventorySize` | `int`             | Number of available slots in the inventory.                |

Inventory updates trigger replication through `OnRep` callbacks and `OnItemChanged` events.

---

## Example: Add & Use Item (C++)

```cpp
UInventoryComponentBase* Inventory = PlayerCharacter->FindComponentByClass<UInventoryComponentBase>();
UObject* Item = NewObject<UMyPotionItem>();

// This needs to be on the server in order to be used like this
int32 Remaining = 0;
if (Inventory->AddItem(Item, 5, Remaining))
{
    Inventory->UseItem(Item, 1);
}
```

**Flow:**

1. Validate item and authority.
2. Add item to replicated inventory.
3. Call the item’s `OnUse()` implementation.

---

## Best Practices
- ✅ Always implement IInventoryItemInterface in your item classes.
- ✅ Use delegates (OnItemChanged_Delegate) to update UI efficiently.
- ✅ Avoid calling authority-only methods from clients.
- ✅ Use BlueprintImplementableEvent to extend gameplay logic cleanly.

---
Last Updated: October 2025
Version: 1.1.0
