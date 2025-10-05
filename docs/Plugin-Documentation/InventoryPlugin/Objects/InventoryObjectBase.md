---
sidebar_label: 'Inventory Object Base'
---
# `UInventoryObjectBase`

> The **base class for all inventory item objects**.
> Provides shared data, editor validation, and default implementations for the `IInventoryItemInterface`.

---

## Overview

`UInventoryObjectBase` serves as the **foundation** for all items used within the Inventory Plugin.
It defines the core metadata (name, description, icon, stack size) and provides default implementations
for the `IInventoryItemInterface`.

---

## Class Declaration

```cpp
UCLASS(Abstract, Blueprintable, BlueprintType, EditInlineNew, meta=(ShowWorldContextPin))
class INVENTORYPLUGIN_API UInventoryObjectBase 
    : public UObject, 
      public IInventoryItemInterface
{
    GENERATED_BODY()

public:
    virtual int32 GetMaxStackSize_Implementation() const override;
    virtual FText GetItemName_Implementation() const override;
    virtual FText GetItemDescription_Implementation() const override;
    virtual UTexture2D* GetItemIcon_Implementation() const override;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Inventory Item")
    FText ItemDescription;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Inventory Item")
    FText ItemName;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Inventory Item")
    int32 MaxStack;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Inventory Item")
    UTexture2D* ItemIcon;

#if WITH_EDITOR
    virtual EDataValidationResult IsDataValid(FDataValidationContext& Context) const override;
#endif
};
```

---

## Details

### Inheritance

* **Parent Class:** `UObject`
* **Implements:** `IInventoryItemInterface`

### Specifiers

| Specifier             | Description                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| `Abstract`            | Cannot be instantiated directly. Must be subclassed.                         |
| `Blueprintable`       | Can be extended via Blueprints.                                              |
| `BlueprintType`       | Usable as a variable type in Blueprints.                                     |
| `EditInlineNew`       | Allows editing instances directly in the editor (ideal for instanced items). |
| `ShowWorldContextPin` | Enables world context pin when used in Blueprint functions.                  |

---

## Properties

| Property          | Type          | Description                                                                  |
| ----------------- | ------------- | ---------------------------------------------------------------------------- |
| `ItemName`        | `FText`       | The display name of the item. Shown in UI and tooltips.                      |
| `ItemDescription` | `FText`       | Descriptive text about the item.                                             |
| `MaxStack`        | `int32`       | Maximum quantity of the item that can be stacked in a single inventory slot. |
| `ItemIcon`        | `UTexture2D*` | The icon used to visually represent the item in UI.                          |

Example:

```cpp
UPROPERTY(EditAnywhere, BlueprintReadOnly, Category="Inventory Item")
int32 MaxStack = 1;
```

---

## Functions

### `GetItemName()`

Returns the display name of the item.

```cpp
virtual FText GetItemName_Implementation() const override;
```

---

### `GetItemDescription()`

Returns the item’s description text.

```cpp
virtual FText GetItemDescription_Implementation() const override;
```

---

### `GetItemIcon()`

Returns the UI icon representing the item.

```cpp
virtual UTexture2D* GetItemIcon_Implementation() const override;
```

---

### `GetMaxStackSize()`

Returns the maximum number of items that can stack in a single slot.

```cpp
virtual int32 GetMaxStackSize_Implementation() const override;
```

---

### `IsDataValid()`

**Editor-only.** Performs validation checks when editing the item in the Unreal Editor.

```cpp
virtual EDataValidationResult IsDataValid(FDataValidationContext& Context) const override;
```

---

## Example Blueprint Setup


1. Create a new **Blueprint Class** derived from `UInventoryObjectBase`.
2. Fill in the `Item Name`, `Description`, and `Icon`.
3. Set `MaxStack` to the appropriate value (e.g., 1 for unique items, 99 for stackables).

---

## Example Instance

To instance an Inventory Object, simply open the context menu like any other asset.


Select a class that you would like to use for the Inventory Object.


Then add in data.



## Integration

`UInventoryObjectBase` interacts seamlessly with:

* `UItemComponent`: wraps this object on an actor.
* `UInventoryComponentBase`: manages stacking, transfer, and replication.
* `IInventoryItemInterface`: defines item behavior when used, dropped, or transferred.

---

## Example Usage

### C++ Example

```cpp
UCLASS()
class UHealingPotionItem : public UInventoryObjectBase
{
    GENERATED_BODY()

public:
    virtual void OnUse_Implementation(UInventoryComponentBase* InventoryComponent) override
    {
        AActor* Owner = InventoryComponent->GetOwner();
        UE_LOG(LogTemp, Log, TEXT("%s used a Healing Potion!"), *Owner->GetName());
        // Apply healing or other gameplay effect here
    }
};
```

---

## Relationship Diagram

```
UInventoryObjectBase
        ▲
        │
        │ implements
        │
IInventoryItemInterface
        │
        │ used by
        ▼
UInventoryComponentBase ──► Manages items
```

---

## Summary

* `UInventoryObjectBase` defines item **data** and default **interface behavior**.
* It’s fully **Blueprint-compatible** and can be used as either authored or instanced.
* Works directly with the inventory and item components.
* Provides built-in **editor validation** and **UI-friendly fields**.

---

Would you like me to follow this up with a **matching Docusaurus doc for `IInventoryItemInterface`**, including all Blueprint events (`CanBeUsed`, `OnUse`, etc.), their intended behaviors, and example override usage? It would complete the documentation set neatly.
