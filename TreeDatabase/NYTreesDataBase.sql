CREATE DATABASE `NYTreeFilter`;
use NYTreeFilter;
CREATE TABLE if not exists Trees(
	TreeId INT NOT Null auto_increment primary key,
    species varchar(255),
    CommonName varchar (255),
    AGCT enum('Very Poor', 'Poor', 'Fair', 'Good', 'Very Good'),
    ACProd enum('Very Poor', 'Poor', 'Fair', 'Good', 'Very Good'),
	NWIStatus enum('OBL', 'FACW', 'FAC', 'FACU', 'UPL')
);
create table if not exists LandformPref(
	TreeID INT NOT Null auto_increment primary key,
    FloodPlainBottomLand bool,
    UPlandMesic bool,
    UplandDry bool,
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists SiteChemPref(
	TreeID INT NOT Null auto_increment primary key,
    SoilAcidTol bool,
    SoilAlkainTol bool,
    SaltTol bool,
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists Ecoregion(
	TreeID INT NOT Null auto_increment primary key,
    EasternGreatLakeLowLands bool,
    NorthernAlleghenyPlateau bool,
    ErieDriftPlain bool,
    NorthernCoastalZone bool,
    NorthernPiedmont bool,
    RidgeAndValley bool,
    AtlanticCoastalPineBarrens bool,
    NortheasternHighlands bool,
    NorthCentralAppalachian bool,
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists SAFForestTypeGroup(
	TreeID INT NOT Null auto_increment primary key,
    AspenBirch bool,
    ElmAshCottonwood bool,
    LoblollyShortleafPine bool,
    MapleBeechBirch bool,
    OakHickory bool,
    SpruceFir bool,
    WhiteRedJackPine bool,
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists SpeciesCharacteristics(
	TreeID INT NOT Null auto_increment primary key,
    LifeSpane Int,
    TreeHeight Int,
    CanopySpread Int,
    GrowthRate enum('Slow','Moderate','Radpid'),
    ShadeTol enum('Low', 'Imtermidiate', 'High'),
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists EconomicValue(
	TreeID INT NOT Null auto_increment primary key,
    Edible bool,
    Lumber bool,
    FuelWood bool,
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists EcologicalValue(
	TreeID INT NOT Null auto_increment primary key,
    KnownInteractions Int,
    AttractsPollinators bool,
    AttractsBirds bool,
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists PlantingConsiderations(
	TreeID INT NOT Null auto_increment primary key,
    RecomendedForWindbreak bool,
    DeerResistance enum('Very Low','Low','Intermidiate','High','Very High'),
    PestAndPathogenSusceptibility enum('Very Low','Low','Intermidiate','High','Very High'),
    foreign key (TreeId) references Trees (TreeId)
);
