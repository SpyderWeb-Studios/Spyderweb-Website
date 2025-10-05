# `FInventoryArray`

> A **replicated container** for all inventory slots within an `UInventoryComponentBase`.
> Handles replication, synchronization, and change tracking via Unreal’s `FFastArraySerializer`.

---

## Overview

`FInventoryArray` is the **core replicated data structure** used by the Inventory System to manage and synchronize
item data between the server and connected clients.

It holds a list of `FInventorySlot` entries and provides a **custom fast array serializer**
for efficient delta replication.

---

## Struct Declaration

```cpp
class UInventoryComponentBase;

USTRUCT(BlueprintType)
struct FInventoryArray : public FFastArraySerializer
{
    GENERATED_BODY()

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Inventory")
    TArray<FInventorySlot> Items;

    UPROPERTY(VisibleAnywhere, Category = "Inventory")
    TWeakObjectPtr<UInventoryComponentBase> OwningInventory;
    
    bool NetDeltaSerialize(FNetDeltaSerializeInfo & DeltaParms)
    {
        return FFastArraySerializer::FastArrayDeltaSerialize<FInventorySlot, FInventoryArray>(
            Items, DeltaParms, *this
        );
    }

    void MarkInventorySlotDirty(FInventorySlot& InventorySlot, FInventorySlot NewSlotInfo, bool bDeferred);
};

template<>
struct TStructOpsTypeTraits<FInventoryArray> : public TStructOpsTypeTraitsBase2<FInventoryArray>
{
    enum { WithNetDeltaSerializer = true };
};
```

---

## Key Responsibilities

* Manages the **internal array of inventory slots** (`Items`).
* Handles **fast delta serialization** for network replication.
* Notifies the owning inventory when a slot is updated or changed.
* Supports **deferred or immediate dirty marking** for optimized network updates.

---

## Properties

| Property          | Type                                      | Description                                                   |
| ----------------- | ----------------------------------------- | ------------------------------------------------------------- |
| `Items`           | `TArray<FInventorySlot>`                  | Holds all inventory slot entries belonging to this inventory. |
| `OwningInventory` | `TWeakObjectPtr<UInventoryComponentBase>` | Weak pointer to the inventory component that owns this array. |

---

## Replication

`FInventoryArray` leverages Unreal Engine’s `FFastArraySerializer` for efficient network replication of the inventory’s state.

When items are added, removed, or modified, only **changed entries** are sent over the network rather than the entire array.

```cpp
bool NetDeltaSerialize(FNetDeltaSerializeInfo& DeltaParms)
{
    return FFastArraySerializer::FastArrayDeltaSerialize<FInventorySlot, FInventoryArray>(
        Items, DeltaParms, *this
    );
}
```

```cpp
template<>
struct TStructOpsTypeTraits<FInventoryArray> : public TStructOpsTypeTraitsBase2<FInventoryArray>
{
    enum { WithNetDeltaSerializer = true };
};
```

---

## Function: `MarkInventorySlotDirty`

Marks a specific inventory slot as dirty (changed), which triggers replication updates and informs the owning inventory of the modification.

```cpp
void FInventoryArray::MarkInventorySlotDirty(
    FInventorySlot& InventorySlot, 
    FInventorySlot NewSlotInfo, 
    bool bDeferred
)
{
    if (bDeferred)
    {
        UE_LOG(LogTemp, Warning, TEXT("Marking Inventory Slot Dirty Deferred"));
    }
    else
    {
        UE_LOG(LogTemp, Warning, TEXT("Marking Inventory Slot Dirty"));

        InventorySlot.Item = NewSlotInfo.Item;
        InventorySlot.Quantity = NewSlotInfo.Quantity;
        InventorySlot.ServerIndex = NewSlotInfo.ServerIndex;

        MarkItemDirty(InventorySlot);

        if (OwningInventory.IsValid())
        {
            OwningInventory->OnItemChanged(InventorySlot);
        }
    }
}
```

---

### Parameters

| Name            | Type              | Description                                               |
| --------------- | ----------------- | --------------------------------------------------------- |
| `InventorySlot` | `FInventorySlot&` | The existing slot in the array to update.                 |
| `NewSlotInfo`   | `FInventorySlot`  | The new slot data (item, quantity, index).                |
| `bDeferred`     | `bool`            | Whether to defer replication marking (for batch updates). |

---

### Behavior

* When **`bDeferred == true`**, the change is logged but **not immediately replicated**.
* When **`bDeferred == false`**, the slot is updated, marked dirty for replication,
  and the owning inventory’s `OnItemChanged` event is triggered.

---

## Integration

`FInventoryArray` is owned and managed by the `UInventoryComponentBase`,
which uses it for all item storage, replication, and change handling.

### Relationship Diagram

```
UInventoryComponentBase
        │
        ▼
  FInventoryArray
        │
        ▼
  TArray<FInventorySlot>
```

Each `FInventorySlot` represents a single stack of items (object reference + quantity).

---

## Example Usage

```cpp
void FInventoryArray::MarkInventorySlotDirty(FInventorySlot& InventorySlot, FInventorySlot NewSlotInfo, bool bDeferred)
{
    if (!bDeferred)
    {
        InventorySlot = NewSlotInfo;
        MarkItemDirty(InventorySlot);
        
        if (OwningInventory.IsValid())
        {
            OwningInventory->OnItemChanged(InventorySlot);
        }
    }
}
```

When `MarkItemDirty()` is called, Unreal Engine automatically triggers replication updates for that entry.

---

## Summary

* `FInventoryArray` is the **replication backbone** of the inventory system.
* It maintains all inventory slots and syncs them efficiently over the network.
* Handles **slot change notifications** and **replication optimization** through `FFastArraySerializer`.
* Works closely with:

  * `FInventorySlot`
  * `UInventoryComponentBase`

