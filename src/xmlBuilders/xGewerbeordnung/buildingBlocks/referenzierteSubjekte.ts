import { createNatuerlichePerson, type NatuerlichePerson } from "./natuerlichePerson";

export interface ReferenzierteSubjekte {
  natuerlichePerson?: NatuerlichePerson[];
}

export function createReferenzierteSubjekte(
  referenzierteSubjekte: ReferenzierteSubjekte | undefined,
) {
  if (!referenzierteSubjekte) return "";
  return `
    <xga:referenzierteSubjekte>
      ${(referenzierteSubjekte.natuerlichePerson ?? []).map(createNatuerlichePerson).join("\n")}
    </xga:referenzierteSubjekte>`;
}
