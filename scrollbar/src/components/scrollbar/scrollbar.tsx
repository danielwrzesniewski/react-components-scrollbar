import React, { useEffect, useRef,useReducer, useCallback} from 'react';
import './scrollbar.css';
import { ScrollbarReducer, InitScrollbarAction, SetThumbDraggingAction, ScrollbarState } from './scrollbar-logic';

const Scrollbar = ({ children }: { children : React.ReactNode}) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const observer = useRef<ResizeObserver | null>(null);


    const [state, dispatch] = useReducer(ScrollbarReducer, { thumbHeight: 0, thumbIsDraging: false, scrollingFactor:0 } as ScrollbarState);

    const calculateThumb = () => dispatch(new InitScrollbarAction(contentRef.current, containerRef.current))

    const handleThumbMousedown = (e: MouseEvent) => {
        
        e.preventDefault();
        e.stopPropagation();

        if (!state.thumbIsDraging && thumbRef.current) {

            const top = parseInt(thumbRef.current.style.top||'0', 10)
            dispatch(new SetThumbDraggingAction(true, e.clientY - top));
        }

        
    }

    const handleScrollingContent = useCallback(() => {

        const container = containerRef.current;
        const content = contentRef.current;
        const thumb = thumbRef.current;
        if (content && thumb && container) {
            const { clientHeight: containerHeight } = container;
            const { clientHeight: thumbHeight } = thumb;

            const position = content.scrollTop / state.scrollingFactor;
            const v = Math.min(position, containerHeight - thumbHeight);

            thumb.style.top = `${v}px`;
        }

       
    }, [state.scrollingFactor])

    const stopScrolling = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(new SetThumbDraggingAction(false, 0));
        
    }, []);
   
    const startDragingThumb = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
               
        
        const content = contentRef.current;
        const container = containerRef.current;
        const thumb = thumbRef.current;

        if (state.thumbIsDraging && thumb && content && container) {
            
            const { clientHeight: containerHeight } = container;
            const { clientHeight: thumbHeight } = thumb;

            const delta = e.clientY - state.thumbPosition;
            const v = Math.min(Math.max(delta, 0), containerHeight - thumbHeight);
            
            content.scrollTop = v * state.scrollingFactor;

            
        }
    }, [state.thumbIsDraging]);

    

    useEffect(() => {
        if (contentRef.current) {
            const content = contentRef.current;
            observer.current = new ResizeObserver(() => {
                calculateThumb();
            });
            observer.current.observe(content);
            thumbRef.current?.addEventListener('mousedown', handleThumbMousedown);
            contentRef.current?.addEventListener('scroll', handleScrollingContent);
            return () => {
                observer.current?.unobserve(content);
                thumbRef.current?.removeEventListener('mousedown', handleThumbMousedown);
                contentRef.current?.removeEventListener('scroll', handleScrollingContent);
            };
        }
    }, [handleScrollingContent])


    useEffect(() => {
       
        thumbRef.current?.addEventListener('mouseup', stopScrolling);
        document.addEventListener('mousemove', startDragingThumb);
        trackRef.current?.addEventListener('mouseleave', stopScrolling);
        

        return () => {
            document.removeEventListener('mousemove', startDragingThumb);
            thumbRef.current?.removeEventListener('mouseup', stopScrolling);
            trackRef.current?.removeEventListener('mouseleave', stopScrolling);
            
        }

    }, [startDragingThumb, stopScrolling])


    return (
        <div className='s-container' ref={containerRef}>
            <div className='s-content' ref={contentRef}>
                {children}
            </div>
            <div className='s-scrollbar'>
                <div className='s-track' ref={trackRef }>
                    <div className='s-thumb' ref={thumbRef}
                        style={{
                            height: `${state.thumbHeight}px`
                        } }
                    >
                       
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Scrollbar;