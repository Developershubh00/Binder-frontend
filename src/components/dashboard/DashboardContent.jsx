import HomeContent from "../HomeContent";
import TasksContent from "../Tasks/TasksContent";
import PurchaseContent from "../PurchaseContent";
import GenerateBuyerCode from "../GenerateBuyerCode";
import GenerateVendorCode from "../GenerateVendorCode";
import CompanyEssentials from "../CompanyEssentials";
import InternalPurchaseOrder from "../InternalPurchaseOrder/InternalPurchaseOrder";
import IPOMasterCNS from "../IPOManagement/IPOMasterCNS";
import IPODerivedCNS from "../IPOManagement/IPODerivedCNS";
import GeneratePOCode from "../GeneratePOCode";
import BuyerMasterSheet from "../BuyerMasterSheet";
import VendorMasterSheet from "../VendorMasterSheet";
import CompanyEssentialsMasterSheet from "../CompanyEssentialsMasterSheet";
import IPOMasterSheet from "../IPOMasterSheet";
import CompletedIPOs from "../CompletedIPOs";
import UQRFormsPreview from "../UQR_forms/UQRFormsPreview.jsx";
import CourierSlip from "../CourierManagement/CourierSlip.jsx";
import MasterCourierSheet from "../CourierManagement/MasterCourierSheet.jsx";
import InwardStoreSheet from "../InwardStoreSheet.jsx";
import InwardStoreSheetDatabase from "../InwardStoreSheetDatabase.jsx";
import OutwardStoreSheet from "../OutwardStoreSheet.jsx";
import OutwardStoreSheetDatabase from "../OutwardStoreSheetDatabase.jsx";
import StockSheet from "../IMS/StockSheet/StockSheet.jsx";
import MasterStockSheet from "../MasterStockSheet.jsx";
import StoreQualityInbox from "../StoreQualityInbox.jsx";
import PermissionBlocked from "../PermissionBlocked.jsx";
import useCheckPermission from "../../hooks/useCheckPermission";

const DashboardContent = ({
  activePage,
  user,
  tasksView,
  setActivePage,
  codeCreationView,
  setCodeCreationView,
  selectedIpoForCNS,
  setSelectedIpoForCNS,
  selectedIpoForSpec,
  setSelectedIpoForSpec,
  selectedIpoForDerivedCNS,
  setSelectedIpoForDerivedCNS,
  specStepHint,
  setSpecStepHint,
  editingBuyer,
  setEditingBuyer,
  editingVendor,
  setEditingVendor,
  setHoveredMenu,
}) => {
  const checkPermission = useCheckPermission();
  // Render `element` normally when the permission is held, otherwise show it
  // behind the frosted "request access" overlay.
  const gate = (permission, message, element) =>
    checkPermission(permission) ? (
      element
    ) : (
      <PermissionBlocked permission={permission} message={message}>
        {element}
      </PermissionBlocked>
    );
  switch (activePage) {
    case "home":
      return <HomeContent user={user} />;
    case "uqr-forms":
      return (
        <UQRFormsPreview
          mode="forms"
          onBack={() => {
            setActivePage("quality");
            setHoveredMenu("quality");
          }}
          onOpenStoreRequests={() => setActivePage("store-quality-inbox")}
        />
      );
    case "store-quality-inbox":
      return <StoreQualityInbox onBack={() => setActivePage("uqr-forms")} />;
    case "uqr-database":
      return (
        <UQRFormsPreview
          mode="database"
          onBack={() => {
            setActivePage("quality");
            setHoveredMenu("quality");
          }}
        />
      );
    case "courier-slip":
      return <CourierSlip onBack={() => setActivePage("ims")} />;
    case "courier-master":
      return <MasterCourierSheet onBack={() => setActivePage("ims")} />;
    case "inward-store-sheet":
      return <InwardStoreSheet onBack={() => setActivePage("ims")} />;
    case "inward-store-sheet-db":
      return (
        <InwardStoreSheetDatabase
          onBack={() => setActivePage("ims")}
          onOpenForm={() => setActivePage("inward-store-sheet")}
        />
      );
    case "outward-store-sheet":
      return <OutwardStoreSheet onBack={() => setActivePage("ims")} />;
    case "outward-store-sheet-db":
      return (
        <OutwardStoreSheetDatabase
          onBack={() => setActivePage("ims")}
          onOpenForm={() => setActivePage("outward-store-sheet")}
        />
      );
    case "stock-sheet":
      return (
        <StockSheet
          onBack={() => setActivePage("ims")}
          onSaved={() => setActivePage("stock-sheet-db")}
        />
      );
    case "stock-sheet-db":
      return (
        <MasterStockSheet
          onBack={() => setActivePage("ims")}
          onOpenForm={() => setActivePage("stock-sheet")}
        />
      );
    case "tasks":
      return <TasksContent initialView={tasksView} />;
    case "purchase":
      return <PurchaseContent />;
    case "ipo-management":
      if (selectedIpoForSpec) {
        return (
          <InternalPurchaseOrder
            specMode="spec"
            initialOpenIpo={selectedIpoForSpec}
            initialFlowPhase={specStepHint?.flowPhase}
            initialCurrentStep={specStepHint?.currentStep}
            initialSkuId={specStepHint?.skuId}
            highlightOnMount={!!specStepHint}
            onBack={() => {
              setSelectedIpoForSpec(null);
              setSpecStepHint(null);
              setActivePage("ipo-management");
            }}
            onNavigateToCodeCreation={() => {
              setSelectedIpoForSpec(null);
              setSpecStepHint(null);
              setActivePage("code-creation");
              setCodeCreationView(null);
              setHoveredMenu("code-creation");
            }}
            onNavigateToIPO={() => {
              setSelectedIpoForSpec(null);
              setSpecStepHint(null);
              setActivePage("ipo-management");
            }}
          />
        );
      }
      if (selectedIpoForDerivedCNS) {
        return (
          <div
            className="dashboard-content"
            style={{ padding: 24, overflowY: "auto" }}
          >
            <button
              type="button"
              onClick={() => setSelectedIpoForDerivedCNS(null)}
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
                marginBottom: 16,
              }}
            >
              ← Back
            </button>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
              IPC Derived CNS
            </h1>
            <p
              style={{
                color: "#6b7280",
                fontFamily: "ui-monospace, Menlo, Consolas, monospace",
                marginBottom: 16,
              }}
            >
              {selectedIpoForDerivedCNS.ipoCode}
            </p>
            <IPODerivedCNS
              ipo={selectedIpoForDerivedCNS}
              onNavigateToMasterCNS={() => {
                const target = selectedIpoForDerivedCNS;
                setSelectedIpoForDerivedCNS(null);
                setSelectedIpoForCNS({ ...target });
              }}
              onNavigateToSpec={(sectionKey, skuId) => {
                const SECTION_MAP = {
                  "product-spec": { flowPhase: "step0", currentStep: 0 },
                  "cut-sew": { flowPhase: "ipcFlow", currentStep: 0 },
                  "raw-material": { flowPhase: "ipcFlow", currentStep: 1 },
                  consumption: { flowPhase: "ipcFlow", currentStep: 1 },
                  artwork: { flowPhase: "ipcFlow", currentStep: 2 },
                  packaging: { flowPhase: "packaging", currentStep: 0 },
                };
                const hint = SECTION_MAP[sectionKey] || {
                  flowPhase: "step0",
                  currentStep: 0,
                };
                setSpecStepHint({ ...hint, skuId });
                setSelectedIpoForDerivedCNS(null);
                setSelectedIpoForSpec({
                  ...selectedIpoForDerivedCNS,
                });
              }}
            />
          </div>
        );
      }
      if (selectedIpoForCNS) {
        return (
          <div
            className="dashboard-content"
            style={{ padding: 24, overflowY: "auto" }}
          >
            <button
              type="button"
              onClick={() => setSelectedIpoForCNS(null)}
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
                marginBottom: 16,
              }}
            >
              ← Back
            </button>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
              IPO Master CNS
            </h1>
            <p
              style={{
                color: "#6b7280",
                fontFamily: "ui-monospace, Menlo, Consolas, monospace",
                marginBottom: 16,
              }}
            >
              {selectedIpoForCNS.ipoCode}
            </p>
            <IPOMasterCNS ipo={selectedIpoForCNS} />
          </div>
        );
      }
      return (
        <div className="dashboard-content" style={{ padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            IPO Management
          </h1>
        </div>
      );
    case "code-creation":
      if (codeCreationView === "buyer") {
        const buyerForm = (
          <GenerateBuyerCode
            initialData={editingBuyer}
            onBack={() => {
              if (editingBuyer) {
                setEditingBuyer(null);
                setCodeCreationView("buyer-existing");
              } else {
                setCodeCreationView(null);
              }
              setActivePage("code-creation");
              setHoveredMenu("code-creation");
            }}
            onSaved={() => {
              setEditingBuyer(null);
              setActivePage("code-creation");
              setCodeCreationView("buyer-existing");
              setHoveredMenu("code-creation");
            }}
          />
        );
        // Gate the Generate Buyer Code screen on the create permission — when
        // blocked, show the form blurred behind the "contact admin" overlay.
        if (!checkPermission("code.buyer.all.create")) {
          return (
            <PermissionBlocked
              permission="code.buyer.all.create"
              message="You don't have permission to generate buyer codes. Please contact your admin to request access."
            >
              {buyerForm}
            </PermissionBlocked>
          );
        }
        return buyerForm;
      }
      if (codeCreationView === "buyer-existing") {
        const buyerSheet = (
          <BuyerMasterSheet
            onBack={() => {
              setActivePage("code-creation");
              setCodeCreationView(null);
              setHoveredMenu("code-creation");
            }}
            onEditBuyer={(buyer) => {
              setEditingBuyer(buyer);
              setActivePage("code-creation");
              setCodeCreationView("buyer");
              setHoveredMenu("code-creation");
            }}
          />
        );
        // Gate viewing the Buyer Master Sheet on the read permission.
        if (!checkPermission("code.buyer.all.read")) {
          return (
            <PermissionBlocked
              permission="code.buyer.all.read"
              message="You don't have permission to view the buyer master sheet. Please contact your admin to request access."
            >
              {buyerSheet}
            </PermissionBlocked>
          );
        }
        return buyerSheet;
      }
      if (codeCreationView === "vendor") {
        return gate(
          "code.vendor.all.create",
          "You don't have permission to generate vendor codes. Please contact your admin to request access.",
          <GenerateVendorCode
            initialData={editingVendor}
            onBack={() => {
              if (editingVendor) {
                setEditingVendor(null);
                setCodeCreationView("vendor-existing");
              } else {
                setCodeCreationView(null);
              }
              setActivePage("code-creation");
              setHoveredMenu("code-creation");
            }}
            onSaved={() => {
              setEditingVendor(null);
              setActivePage("code-creation");
              setCodeCreationView("vendor-existing");
              setHoveredMenu("code-creation");
            }}
          />,
        );
      }
      if (codeCreationView === "vendor-existing") {
        return gate(
          "code.vendor.all.read",
          "You don't have permission to view the vendor master sheet. Please contact your admin to request access.",
          <VendorMasterSheet
            onBack={() => {
              setActivePage("code-creation");
              setCodeCreationView(null);
              setHoveredMenu("code-creation");
            }}
            onEditVendor={(vendor) => {
              setEditingVendor(vendor);
              setActivePage("code-creation");
              setCodeCreationView("vendor");
              setHoveredMenu("code-creation");
            }}
          />,
        );
      }
      if (codeCreationView === "company-essentials") {
        return gate(
          "code.ess.all.create",
          "You don't have permission to generate company essentials codes. Please contact your admin to request access.",
          <CompanyEssentials
            onBack={() => {
              setActivePage("code-creation");
              setCodeCreationView(null);
              setHoveredMenu("code-creation");
            }}
          />,
        );
      }
      if (codeCreationView === "company-essentials-master") {
        return gate(
          "code.ess.all.read",
          "You don't have permission to view the company essentials master sheet. Please contact your admin to request access.",
          <CompanyEssentialsMasterSheet
            onBack={() => {
              setActivePage("code-creation");
              setCodeCreationView(null);
              setHoveredMenu("code-creation");
            }}
          />,
        );
      }
      if (codeCreationView === "internal-purchase-order") {
        return gate(
          "code.ipo.all.create",
          "You don't have permission to generate IPO codes. Please contact your admin to request access.",
          <InternalPurchaseOrder
            specMode="create"
            onBack={() => {
              setActivePage("code-creation");
              setCodeCreationView(null);
              setHoveredMenu("code-creation");
            }}
            onNavigateToCodeCreation={() => {
              setActivePage("code-creation");
              setCodeCreationView(null);
              setHoveredMenu("code-creation");
            }}
            onNavigateToIPO={() => setActivePage("code-creation")}
          />,
        );
      }
      if (codeCreationView === "internal-purchase-order-master") {
        return gate(
          "code.ipo.all.read",
          "You don't have permission to view the IPO master sheet. Please contact your admin to request access.",
          <IPOMasterSheet
            onBack={() => {
              setActivePage("code-creation");
              setCodeCreationView(null);
              setHoveredMenu("code-creation");
            }}
          />,
        );
      }
      if (codeCreationView === "completed-ipos") {
        return gate(
          "code.ipo.all.read",
          "You don't have permission to view completed IPOs. Please contact your admin to request access.",
          <CompletedIPOs
            onBack={() => {
              setActivePage("code-creation");
              setCodeCreationView(null);
              setHoveredMenu("code-creation");
            }}
          />,
        );
      }
      if (codeCreationView === "generate-po") {
        return (
          <GeneratePOCode
            onBack={() => {
              setActivePage("code-creation");
              setCodeCreationView(null);
              setHoveredMenu("code-creation");
            }}
          />
        );
      }
      return <div className="dashboard-content" />;
    default:
      return <div className="dashboard-content" />;
  }
};

export default DashboardContent;
