module paperairplane::paperairplane {
    use std::string::String;
    use sui::display;
    use sui::{
        display,
        package,
        event::{emit},
    };
    use sui::object::{Self, UID};
    use sui::package;
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::transfer::public_transfer;
    use paperairplane::utils::{to_b36};

    /*-------错误码-------*/
    const ENOT_OWNER :u64 = 0;
    const E_EXSITS :u64 = 1;

    /*-----事件------*/
    public struct CreatedAirplane has copy, drop {
        event_id: ID,
        name: String,
        b36addr:String
    }


    /*------结构体------*/
    public struct Airplane has key,{
        id: UID,
        name: String,
        content: String,
        owner:address,
        blobs:vector<String>,
        b36addr:String
    }

    public struct Airport has key,state{
        id:UID,
        airplanes:vector<address>
    }

    public struct PAPERAIRPLANE has drop{}

    const  VISUALIZATION_SITE:address = @0x1;

    fun init(otw:PAPERAIRPLANE,ctx:&mut TxContext){
        let publisher = package::claim(otw,ctx);
        let mut site_display = display::new<Airplane>(&publisher,ctx);

        site_display.add(
            b"link".to_string(),
            b"https://{b36addr}.walrus.site".to_string(),
        );

        site_displayadd(
            b"walrus site address".to_string(),
            VISUALIZATION_SITE.to_string(),
        );

        site_display.update_version();


        let airport = Airport{
            id: object::new(ctx),
            airplanes: vector::empty()
        };

        public_share_object(airport);
        public_transfer(publisher,ctx.sender());
        public_transfer(display,ctx.sender());
    }

    public entry fun create_airplane(airport:&mut Airport,name: String, content: String, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let id = object::new(ctx);
        let object_address = object::uid_to_address(&id);
        let b36addr = to_b36(object_address);
        let event_id = id.to_inner();


        let airplane = Airplane {
            id,
            name,
            content,
            owner: sender,
            b36addr: b36addr,
            blobs:vector::empty()
        };

        vector::push_back(&mut airport.airplanes,object_address);

        transfer::share_object(airplane);

        emit(CreatedAirplane {
            event_id,
            name:name,
            b36addr: b36addr
        });
    }


    public entry fun add_blob(plane:&mut Airplane,blob:String,ctx: &mut TxContext){
        assert!(plane.owner == ctx.sender(),ENOT_OWNER);
        assert!(!vector::contains(&plane.blobs,&blob),E_EXSITS);

        vector::push_back(&mut plane.blobs,blob);
    }
}
