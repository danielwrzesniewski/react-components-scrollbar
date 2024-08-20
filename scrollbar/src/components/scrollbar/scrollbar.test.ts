import { ScrollbarServices, InitScrollbarAction } from "./scrollbar-logic";


test('calculate thumb height', () => {

    const container = document.createElement('div') as HTMLDivElement;
    const content = document.createElement('div') as HTMLDivElement;

    jest.spyOn(container, "clientHeight","get").mockImplementation(
        () => 1000
    )

    jest.spyOn(content, "clientHeight", "get").mockImplementation(
        () => 2000
    )

    const height = ScrollbarServices.setThumbHeight(content, container, 20);
    expect(height).toBe(500);

})

test('check types', () => {


    const action = new InitScrollbarAction();
    

    expect(action.constructor).toBe(InitScrollbarAction);
    
})




