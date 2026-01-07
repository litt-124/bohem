export default class ViewPortHelper {

    /**
     * Returns TRUE if element is visible or distance to it less than offset
     *
     * @param element
     * @param offset
     * @returns {boolean}
     */
    static visible(element, offset = 400) {

        let windowHeight = window.innerHeight;
        let scrollY = window.scrollY || window.pageYOffset;

        let scrollPosition = scrollY + windowHeight;
        let elementPosition = element.getBoundingClientRect().top;

        return scrollPosition > elementPosition - 400;
    }

}