
// /**
//  *
//  * This can be used to know the scrollview position & height and therefore
//  * take a fullscreen screenshot
//  */
// // function testOnLayout(testID, e) {
// //   // scrollViewLatyous[testID] = e.nativeEvent.layout;

// //   console.info(e.nativeEvent.layout);
// // }

//   export const tapOn = async (testID: string) => {
//     debug('Tapping on element with testID', testID);
  
//     const element = await getElementByTestId(testID);
  
//     // @ts-ignore
//     element.onPress();
//   };
  
//   // export const focusInput = async (testID: string) => {
//   //   debug('Focusing on element with testID', testID);
  
//   //   const element = await getElementByTestId(testID);
  
//   //   element.ref.current.focus();
//   // };
  
//   // export const fillInput = async (testID: string, value: string) => {
//   //   debug(`Filling field testID ${testID}`, `with value ${value}`);
  
//   //   const element = await getElementByTestId(testID);
  
//   //   element.onChangeText(value);
//   // };
  
//   // export const getScrollViewLayout = async (testID: string) => {
//   //   debug('Getting ScrollView layout for testID', testID);
  
//   //   await getElementByTestId(testID);
  
//   //   return scrollViewLatyous[testID];
//   // };
  
//   // export const scrollViewTo = async (testID: string, y: number) => {
//   //   debug(`scrolling ScrollView: ${testID}`, `to value ${y}`);
  
//   //   const element = await getElementByTestId(testID);
  
//   //   element.ref.current.scrollTo({ y });
//   // };
  
//   // export const scrollViewToEnd = async (testID: string) => {
//   //   debug(`scrolling ScrollView: ${testID}`, 'to value end');
  
//   //   const element = await getElementByTestId(testID);
  
//   //   element.ref.current.scrollToEnd();
//   // };
  
//   // export const elementToBeVisible = async (testID: string) => {
//   //   await getElementByTestId(testID);
//   // };
  
//   const debug = (action: string, value: string) => {
//     console.debug(`DIRTY HACK: ${action}`, value);
//   };
  