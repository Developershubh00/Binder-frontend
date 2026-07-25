// Sidebar nav icons, rendered from image assets in src/assets (not inline SVGs).
// Each icon takes a `size` prop (px) so it drops into the sidebar like the old ones.
import homeImg from "../../assets/home.png";
import taskImg from "../../assets/task.png";
import codeCreationImg from "../../assets/codeCreation.png";
import ipoImg from "../../assets/IPO.jpg";
import purchaseImg from "../../assets/purchase.png";
import inventoryImg from "../../assets/inventory.png";

const AssetIcon = ({ src, alt, size = 18 }) => (
  <img
    src={src}
    alt={alt}
    width={size}
    height={size}
    style={{ width: size, height: size, objectFit: "contain" }}
    aria-hidden="true"
    draggable="false"
  />
);

export const HomeIcon = (props) => <AssetIcon src={homeImg} alt="Home" {...props} />;
export const TasksIcon = (props) => <AssetIcon src={taskImg} alt="Tasks" {...props} />;
export const CodeCreationIcon = (props) => (
  <AssetIcon src={codeCreationImg} alt="Code Creation" {...props} />
);
export const IpoIcon = (props) => <AssetIcon src={ipoImg} alt="IPO Management" {...props} />;
export const PurchaseIcon = (props) => (
  <AssetIcon src={purchaseImg} alt="Purchase" {...props} />
);
export const InventoryIcon = (props) => (
  <AssetIcon src={inventoryImg} alt="Inventory Management" {...props} />
);
