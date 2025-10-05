---
sidebar_label: 'Item Component'
---

# `UItemComponent`

> A lightweight wrapper component that adds **Inventory Object functionality** to an actor.
> It bridges your actor and the item data it represents or manages.

---

## Overview

The `UItemComponent` provides a simple and consistent way to associate an `Inventory Object` (an item definition or instance) with an actor in the world.
It is up to the **owning actor** to define how the item is handled, such as when it is picked up, equipped, or dropped.

---

## Item Configuration

You can configure the component to use one of two item approaches:

| Type               | Description                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **Instanced Item** | Creates a unique instance of the item at runtime. Useful for items with unique states (e.g., durability, modifiers). |
| **Authored Item**  | References a predefined item asset. Useful for static, data-driven items shared across actors.                       |


---

## Usage

Accessing the underlying `Inventory Object` is straightforward:

1. Retrieve the `UItemComponent` from your actor.
2. Call the `GetItem()` function to access the associated item object.

```cpp
UItemComponent* ItemComp = MyActor->FindComponentByClass<UItemComponent>();
if (ItemComp)
{
    UInventoryObjectBase* Item = ItemComp->GetItem();
    // Now you can access all item data and behavior
}
```


---

## API Reference

### `GetItem()`

```cpp
UFUNCTION(BlueprintPure, Category = "Item")
UInventoryObjectBase* GetItem() const { return bUseInstancedItem ? InstancedItem : Item; }
```

**Description:**
Returns the item currently associated with this component.
If `bUseInstancedItem` is true, it returns the **Instanced Item**; otherwise, it returns the **Authored Item**.

**Blueprint Access:** ✅ Available
**Pure:** ✅ Yes
**Category:** `Item`

---

## Properties

| Property            | Type                                | Description                                                                                           |
| ------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `Item`              | `UInventoryObjectBase*`             | Reference to a pre-authored item. Used when `bUseInstancedItem` is **false**.                         |
| `InstancedItem`     | `UInventoryObjectBase*` (Instanced) | A unique item instance created per component. Used when `bUseInstancedItem` is **true**.              |
| `bUseInstancedItem` | `bool`                              | Determines whether this component uses an instanced or authored item reference. Defaults to **true**. |

**Example:**

```cpp
UPROPERTY(EditAnywhere, Category = "Item", meta = (EditCondition = "!bUseInstancedItem", EditConditionHides))
UInventoryObjectBase* Item;

UPROPERTY(EditAnywhere, Instanced, Category = "Item", meta = (EditCondition = "bUseInstancedItem", EditConditionHides))
UInventoryObjectBase* InstancedItem;

UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Item")
bool bUseInstancedItem = true;
```

---
Last Updated: October 2025
Version: 1.1.0
