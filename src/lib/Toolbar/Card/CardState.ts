import { writable } from "svelte/store";
import { CardType } from "./CardTypes";

export const activeCard = writable<CardType>(CardType.None);
let ignoreClickOutsideCount = 0

export function toggleCard(cardType: CardType) {
    activeCard.update(activeCardType => {
        if (activeCardType === cardType) {
            return CardType.None
        } else {
            return cardType
        }
    })
}

export function toggleCardWithinCard(cardType: CardType) {
    ignoreNextClickOutside()
    toggleCard(cardType)
}

export function ignoreNextClickOutside() {
    ignoreClickOutsideCount += 1
    console.log(ignoreClickOutsideCount)
}

export function handleClickOutsideCard(cardType: CardType) {
    activeCard.update(activeCardType => {
        if (activeCardType === cardType) {
            if (ignoreClickOutsideCount > 0) {
                ignoreClickOutsideCount -= 1
                return activeCardType
            }
            return CardType.None
        } else {
            return activeCardType
        }
    })
}