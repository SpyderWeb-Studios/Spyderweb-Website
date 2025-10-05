# IInventoryItemInterface

**Module:** `InventoryPlugin`  
**Header:** `IInventoryItemInterface.h`  
**Base Class:** `UInterface`  
**Type:** Interface (Blueprint Native)  

---

## Overview

`IInventoryItemInterface` defines a standard contract for any item that can be stored and managed within an inventory system.  
Each function provides control over how the item interacts with an inventory component — allowing validation, interaction, and behavior customization when the item is used, dropped, or transferred.

This interface is **BlueprintNative**, meaning it can be implemented in both **C++** and **Blueprints**.

---

## Functions

### `CanBeAddedToInventory(UInventoryComponentBase* InventoryComponent)`
```cpp
UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Inventory|Item")
bool CanBeAddedToInventory(UInventoryComponentBase* InventoryComponent) const;
````

Determines whether this item can currently be added to the specified inventory.

**Parameters:**

| Name                 | Type                       | Description                               |
| -------------------- | -------------------------- | ----------------------------------------- |
| `InventoryComponent` | `UInventoryComponentBase*` | The inventory attempting to add the item. |

**Returns:**
`bool` — `true` if the item can be added; `false` otherwise.

---

### `CanBeRemovedFromInventory(UInventoryComponentBase* InventoryComponent)`

```cpp
UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Inventory|Item")
bool CanBeRemovedFromInventory(UInventoryComponentBase* InventoryComponent) const;
```

Checks whether the item can be removed from the specified inventory.

**Parameters:**

| Name                 | Type                       | Description                                  |
| -------------------- | -------------------------- | -------------------------------------------- |
| `InventoryComponent` | `UInventoryComponentBase*` | The inventory attempting to remove the item. |

**Returns:**
`bool` — `true` if the item can be removed; `false` otherwise.

---

### `CanBeTransferred(UInventoryComponentBase* InventoryComponent)`

```cpp
UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Inventory|Item")
bool CanBeTransferred(UInventoryComponentBase* InventoryComponent) const;
```

Determines if the item can be transferred to or from the specified inventory.

**Parameters:**

| Name                 | Type                       | Description                             |
| -------------------- | -------------------------- | --------------------------------------- |
| `InventoryComponent` | `UInventoryComponentBase*` | The inventory involved in the transfer. |

**Returns:**
`bool` — `true` if the item is transferable; otherwise `false`.

---

### `CanBeUsed(UInventoryComponentBase* InventoryComponent)`

```cpp
UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Inventory|Item")
bool CanBeUsed(UInventoryComponentBase* InventoryComponent) const;
```

Determines whether the item can be used within the specified inventory context.
For example, some items may require the player to meet certain conditions before use.

**Parameters:**

| Name                 | Type                       | Description                       |
| -------------------- | -------------------------- | --------------------------------- |
| `InventoryComponent` | `UInventoryComponentBase*` | The inventory that owns the item. |

**Returns:**
`bool` — `true` if usable; `false` otherwise.

---

### `CanBeDropped(UInventoryComponentBase* InventoryComponent)`

```cpp
UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Inventory|Item")
bool CanBeDropped(UInventoryComponentBase* InventoryComponent) const;
```

Checks if this item can be dropped from the specified inventory.

**Parameters:**

| Name                 | Type                       | Description                        |
| -------------------- | -------------------------- | ---------------------------------- |
| `InventoryComponent` | `UInventoryComponentBase*` | The inventory that holds the item. |

**Returns:**
`bool` — `true` if droppable; otherwise `false`.

---

### `OnUse(UInventoryComponentBase* InventoryComponent)`

```cpp
UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Inventory|Item")
void OnUse(UInventoryComponentBase* InventoryComponent);
```

Called when the item is used from a specific inventory.
Implement the item’s use behavior here — such as applying an effect, consuming the item, or equipping it.

**Parameters:**

| Name                 | Type                       | Description                                  |
| -------------------- | -------------------------- | -------------------------------------------- |
| `InventoryComponent` | `UInventoryComponentBase*` | The inventory that triggered the use action. |

**Example Use Cases:**

* Consume a potion to restore health
* Equip a weapon or armor
* Trigger a special ability

---

### `OnDrop(UInventoryComponentBase* InventoryComponent, int Quantity)`

```cpp
UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Inventory|Item")
void OnDrop(UInventoryComponentBase* InventoryComponent, int Quantity);
```

Called when the item is dropped from an inventory.

**Parameters:**

| Name                 | Type                       | Description                               |
| -------------------- | -------------------------- | ----------------------------------------- |
| `InventoryComponent` | `UInventoryComponentBase*` | The inventory performing the drop action. |
| `Quantity`           | `int`                      | The number of items being dropped.        |

**Example Use Cases:**

* Spawn a world pickup actor representing the dropped items
* Reduce the stack count in the inventory

---

## Implementation Notes

### 1. Inherit the Interface

```cpp
class AMyItem : public AActor, public IInventoryItemInterface
{
    GENERATED_BODY()
    ...
};
```

### 2. Implement the Interface Methods

```cpp
bool AMyItem::CanBeUsed_Implementation(UInventoryComponentBase* InventoryComponent) const
{
    return true; // Example: always usable
}

void AMyItem::OnUse_Implementation(UInventoryComponentBase* InventoryComponent)
{
    // Apply item effect or perform logic here
}
```

### 3. Expose to Blueprints

All functions are **BlueprintCallable** and **BlueprintNativeEvent**,
meaning you can override them in Blueprint for flexible item logic without recompiling code.

---

## Blueprint Integration

| Function                    | Callable in Blueprint | Can be Overridden | Notes                          |
| --------------------------- | --------------------- | ----------------- | ------------------------------ |
| `CanBeAddedToInventory`     | ✅                     | ✅                 | Validate adding to inventory   |
| `CanBeRemovedFromInventory` | ✅                     | ✅                 | Define removal rules           |
| `CanBeTransferred`          | ✅                     | ✅                 | Manage ownership or exchange   |
| `CanBeUsed`                 | ✅                     | ✅                 | Check use conditions           |
| `CanBeDropped`              | ✅                     | ✅                 | Handle drop logic              |
| `OnUse`                     | ✅                     | ✅                 | Trigger use behavior           |
| `OnDrop`                    | ✅                     | ✅                 | Spawn dropped items or visuals |

---

## Example Implementation

A consumable item (e.g., a health potion):

```cpp

bool AHealthPotion::CanBeUsed_Implementation(UInventoryComponentBase* InventoryComponent) const
{
    if (!InventoryComponent) return false;

    ACustomCharacter* OwnerCharacter = Cast<ACustomCharacter>(InventoryComponent->GetOwner());
    return OwnerCharacter && OwnerCharacter->GetHealth() < OwnerCharacter->GetMaxHealth();
}

void AHealthPotion::OnUse_Implementation(UInventoryComponentBase* InventoryComponent)
{
    if (ACharacter* OwnerCharacter = Cast<ACustomCharacter>(InventoryComponent->GetOwner()))
    {
        OwnerCharacter->RestoreHealth(50);
        InventoryComponent->RemoveItem(this, 1);
    }
}
```

---
**Last Updated:** October 2025
**Version:** 1.1.0

```

