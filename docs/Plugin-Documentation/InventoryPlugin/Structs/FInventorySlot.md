# `FInventorySlot`

> Represents a single **slot in an inventory**, holding an item reference and quantity.
> Works with [`FInventoryArray`](FInventoryArray.md) for replication and change tracking.

---

## Overview

`FInventorySlot` is a lightweight structure used by `FInventoryArray` to store individual inventory entries.
It implements `FFastArraySerializerItem` so that changes to individual slots can be replicated efficiently.

Each slot contains:

* The **item object** stored in the slot.
* The **quantity** of that item.
* The **server index** for network replication.

---

## Struct Declaration

```cpp
USTRUCT(BlueprintType)
struct FInventorySlot : public FFastArraySerializerItem
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Inventory")
    UObject* Item;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Inventory")
    int32 Quantity;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Inventory")
    int32 ServerIndex;

    FInventorySlot()
    {
        Item = nullptr;
        Quantity = 0;
        ServerIndex = -1;
    }

    void PreReplicatedRemove(const struct FInventoryArray& InArraySerializer);
    void PostReplicatedAdd(const struct FInventoryArray& InArraySerializer);
    void PostReplicatedChange(const struct FInventoryArray& InArraySerializer);

    FString GetDebugString() const
    {
        return FString::Printf(TEXT("Item: %s, Quantity: %d, ServerIndex: %d"), *GetNameSafe(Item), Quantity, ServerIndex);
    }
};
```

---

## Properties

| Property      | Type       | Description                                                  |
| ------------- | ---------- | ------------------------------------------------------------ |
| `Item`        | `UObject*` | Reference to the inventory item stored in this slot.         |
| `Quantity`    | `int32`    | Number of items in this slot.                                |
| `ServerIndex` | `int32`    | Index used for replication and identification on the server. |

---

## Replication Hooks

`FInventorySlot` provides hooks called automatically during replication:

### `PreReplicatedRemove`

Called **before a slot is removed** from the replicated array.

```cpp
void FInventorySlot::PreReplicatedRemove(const FInventoryArray& InArraySerializer)
{
    UE_LOG(LogTemp, Warning, TEXT("PreReplicatedRemove: %s"), *GetDebugString());
}
```

### `PostReplicatedAdd`

Called **after a slot is added** to the replicated array.

```cpp
void FInventorySlot::PostReplicatedAdd(const FInventoryArray& InArraySerializer)
{
    UE_LOG(LogTemp, Warning, TEXT("PostReplicatedAdd: %s"), *GetDebugString());
}
```

### `PostReplicatedChange`

Called **after a slot is modified** in the replicated array.

```cpp
void FInventorySlot::PostReplicatedChange(const FInventoryArray& InArraySerializer)
{
    UE_LOG(LogTemp, Warning, TEXT("PostReplicatedChange: %s"), *GetDebugString());

    if (InArraySerializer.OwningInventory.IsValid())
    {
        InArraySerializer.OwningInventory->OnItemChanged(*this);
    }
}
```

---

## Debugging

`GetDebugString()` provides a simple string representation of the slot:

```cpp
FString GetDebugString() const
{
    return FString::Printf(TEXT("Item: %s, Quantity: %d, ServerIndex: %d"), *GetNameSafe(Item), Quantity, ServerIndex);
}
```

Use this in logs or debugging tools to inspect inventory slots at runtime.

---

## Usage Notes

* Each `FInventorySlot` is **managed by `FInventoryArray`**, which handles replication and updates.
* **Quantity = 0** indicates an empty slot; **Item = nullptr** for unassigned slots.
* **ServerIndex** helps maintain consistency between server and client inventories.

