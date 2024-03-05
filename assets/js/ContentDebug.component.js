import { html, tag, setLet } from "taggedjs";
export const contentDebug = tag(() => {
    let renderCount = setLet(0)(x => [renderCount, renderCount = x]);
    ++renderCount;
    return html `
    <div style="font-size:0.8em">You should see "0" here => "${0}"</div>
    <!--proof you cannot see false values -->
    <div style="font-size:0.8em">You should see "" here => "${false}"</div>
    <div style="font-size:0.8em">You should see "" here => "${null}"</div>
    <div style="font-size:0.8em">You should see "" here => "${undefined}"</div>
    <!--proof you can see true booleans -->
    <div style="font-size:0.8em">You should see "true" here => "${true}"</div>
    <!--proof you can try to use the tagVar syntax -->
    <div style="font-size:0.8em">You should see "${'{'}22${'}'}" here => "{22}"</div>
    <div style="font-size:0.8em">You should see "${'{'}__tagVar0${'}'}" here => "{__tagVar0}"</div>
    <div style="font-size:0.8em">should be a safe string no html "&lt;div&gt;hello&lt;/div&gt;" here => "${'<div>hello</div>'}"</div>
    (render count ${renderCount})
  `;
});
//# sourceMappingURL=ContentDebug.component.js.map