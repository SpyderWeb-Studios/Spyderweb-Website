---
sidebar_label: 'Quick Setup'
---

# Quick Setup Guide – Inventory System

This guide walks you through the minimal steps to get the Inventory System running in your Unreal Engine project.

---

## 1. Add the Inventory Component to an Actor

1. Open your actor in the editor.
2. Add a **`UInventoryComponentBase`** component.
3. Configure the **Inventory Size** property (number of slots).

```cpp
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Inventory")
UInventoryComponentBase* InventoryComponent;
```

---

## 2. Create Inventory Items

You can use either **Authored Items** (shared assets) or **Instanced Items** (unique per actor).

* **Authored Items**: Create a `UInventoryObjectBase` asset and assign it directly.
* **Instanced Items**: Add an Item Component to the actor and set `bUseInstancedItem = true`.

```cpp
UFUNCTION(BlueprintPure, Category = "Item")
UInventoryObjectBase* GetItem() const { return bUseInstancedItem ? InstancedItem : Item; }
```

---

## 3. Add Items to Inventory

Use the `AddItem` function on your inventory component.

```cpp
int32 RemainingAmount;
InventoryComponent->AddItem(MyItemObject, 5, RemainingAmount);
```

---

## 4. Remove or Use Items

* **Remove**:

```cpp
int32 RemainingAmount;
InventoryComponent->RemoveItem(MyItemObject, 2, RemainingAmount);
```

* **Use**:

```cpp
InventoryComponent->UseItem(MyItemObject, 1);
```

* You can also perform these actions **by index**:

```cpp
InventoryComponent->UseItemAtIndex(0, 1, true); // bUseLocalIndex = true
```

---

## 5. Transfer Items Between Inventories

```cpp
InventoryComponent->TransferItem(MyItemObject, 1, TargetInventoryComponent);
```

---

## 6. Drop Items

```cpp
InventoryComponent->DropItem(MyItemObject, 1);
```

* Supports dropping **by object** or **by slot index**.
* Triggers the item’s `OnDrop` function if implemented.

---

## 7. Hooks & Delegates

* **Blueprint Events**:

  * `K2_OnItemAdded`
  * `K2_OnItemRemoved`
* **Delegates for UI / Event-Driven Updates**:

  * `OnItemChanged_Delegate`
  * `OnItemRemovedFromInventoryDelegate`
  * `OnItemAddedToInventoryDelegate`

