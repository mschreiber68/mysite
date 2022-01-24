export function removeModifierClasses(element) {
    element.className = element.className.replace(/\S+--\S+/, '');
}

export function applySoleModifier(element, className) {
    removeModifierClasses(element);
    element.classList.add(className);
}