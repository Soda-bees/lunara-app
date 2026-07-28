export function getPartnerDisplayNames(primaryUserName: string) {
  const partnerName = primaryUserName || 'They';
  const partnerNamePossessive = primaryUserName
    ? `${primaryUserName}'s`
    : 'their';
  return { partnerName, partnerNamePossessive };
}
