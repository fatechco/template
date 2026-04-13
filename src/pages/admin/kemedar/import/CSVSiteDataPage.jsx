import CSVImportTemplate from "./CSVImportTemplate";

export default function CSVSiteDataPage() {
  return (
    <CSVImportTemplate
      title="Import Site Data"
      description="Upload bulk site configuration data like categories, purposes, amenities, etc."
      template="site-data"
    />
  );
}