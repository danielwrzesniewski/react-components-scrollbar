
export interface ScrollbarState {
    thumbHeight: number,
    scrollingFactor: number;
    thumbIsDraging: boolean,
    thumbPosition: number
}

export type Action = object

export class InitScrollbarAction implements Action {
    content: HTMLDivElement|null;
    container: HTMLDivElement | null;

    constructor(content: HTMLDivElement | null, container: HTMLDivElement | null) {
        this.container = container;
        this.content = content;
    }
}

export class SetThumbDraggingAction implements Action {
    dragging: boolean;
    thumbPosition: number;
    constructor(dragging: boolean, thumbPosition: number) {
        this.dragging = dragging;
        this.thumbPosition = thumbPosition;
    }


}



export const ScrollbarReducer = (state: ScrollbarState, action: Action): ScrollbarState => {

    switch (action.constructor) {

        case InitScrollbarAction:
            {
                const data = action as InitScrollbarAction;

                return {
                    ...state,
                    thumbHeight: ScrollbarServices.setThumbHeight(data.content, data.container, 20),
                    scrollingFactor: ScrollbarServices.calculateScrollingFactor(data.content, data.container)
                } as ScrollbarState;

            }
        case SetThumbDraggingAction:
            {
                const data = action as SetThumbDraggingAction;
                return {
                    ...state,
                    thumbIsDraging: data.dragging,
                    thumbPosition: data.thumbPosition
                } as ScrollbarState;
            }
        default:
            return state;
    }

}


export const ScrollbarServices = {
    calculateScrollingFactor: (content: HTMLDivElement | null, container: HTMLDivElement | null) => {

        if (content && container) {
            const { scrollHeight: contentTotalHeight } = content;
            const { clientHeight: containerHeight } = container;
            return contentTotalHeight /containerHeight ;
        }

        return 0;
    },
    setThumbHeight: (content: HTMLDivElement | null, container: HTMLDivElement | null, minThum : number ) => {
        if (content && container) {
            const { scrollHeight: contentTotalHeight } = content;
            const { clientHeight: containerHeight } = container;
            return Math.max(containerHeight / contentTotalHeight * containerHeight, minThum);
        }

        return 0;

    }

}



