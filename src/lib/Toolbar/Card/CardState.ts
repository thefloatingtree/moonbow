import { writable } from "svelte/store";
import { CardType } from "./CardTypes";

export const activeCard = writable<CardType>(CardType.None);

export function toggleCard(cardType: CardType) {
    activeCard.update(activeCardType => {
        if (activeCardType === cardType) {
            return CardType.None;
        } else {
            return cardType;
        }
    })
}

export function handleClickOutsideCard(cardType: CardType) {
    activeCard.update(activeCardType => {
        if (activeCardType === cardType) {
            return CardType.None;
        } else {
            return activeCardType;
        }
    })
}