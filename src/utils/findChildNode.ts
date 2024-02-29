import React, { Children, ReactNode } from "react";

function findChildNode(typeName: string, children: ReactNode): FindChildNodeResult {  
    const matches: ReactNode[] = [];
    const mismatches: ReactNode[] = [];
    Children.forEach(children, child => {
      if (React.isValidElement(child) && (child.type as ChildType).name === typeName) {
        matches.push(child);
      }
      else {
        mismatches.push(child);
      }
    });

    return { 
      match: matches[0], 
      mismatches
    };
}

interface FindChildNodeResult {
  match: ReactNode | null;
  mismatches: ReactNode[];
}

interface ChildType {
  name: string;
}

export default findChildNode;
